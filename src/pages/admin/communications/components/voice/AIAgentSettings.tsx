import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Toggle } from '../../../../../components/ui/toggle';
import { useCommunication } from '../../../../../contexts/CommunicationContext';

interface AIAgentSettingsProps {
  open: boolean;
  onClose: () => void;
}

interface VoiceConfig {
  voiceId: string;
  name: string;
  gender: string;
  preview?: string;
}

export const AIAgentSettings: React.FC<AIAgentSettingsProps> = ({
  open,
  onClose
}) => {
  const { retellLoading, agentStatus, retellError, updateAgentConfig, getAgentStatus } = useCommunication();
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    enabled: true,
    afterHours: true,
    lunchHours: true,
    holidays: true,
    customSchedule: false,
    voiceId: 'alloy', // Default voice
    schedule: {
      monday: { start: '17:00', end: '09:00' },
      tuesday: { start: '17:00', end: '09:00' },
      wednesday: { start: '17:00', end: '09:00' },
      thursday: { start: '17:00', end: '09:00' },
      friday: { start: '17:00', end: '09:00' },
      saturday: { start: '00:00', end: '23:59' },
      sunday: { start: '00:00', end: '23:59' }
    },
    customMessage: ''
  });
  
  // Available voice options for the AI agent
  const voiceOptions: VoiceConfig[] = [
    { voiceId: 'alloy', name: 'Alloy', gender: 'neutral' },
    { voiceId: 'shimmer', name: 'Shimmer', gender: 'female' },
    { voiceId: 'nova', name: 'Nova', gender: 'female' },
    { voiceId: 'echo', name: 'Echo', gender: 'male' },
    { voiceId: 'fable', name: 'Fable', gender: 'male' },
    { voiceId: 'onyx', name: 'Onyx', gender: 'male' }
  ];
  
  // Initialize settings from agent status when component mounts
  useEffect(() => {
    if (agentStatus) {
      const agentRecord = agentStatus as Record<string, unknown>;
      setSettings(prev => ({
        ...prev,
        voiceId: (agentRecord.voice_id as string) || 'alloy',
        enabled: true // Default to enabled if we have an agent
      }));
    }
  }, [agentStatus]);
  
  const handleSave = async () => {
    setSaveLoading(true);
    setSaveError(null);
    
    try {
      // Call the RetellAI service to update the agent configuration
      await updateAgentConfig({
        voiceId: settings.voiceId,
        parameters: {
          customSchedule: settings.customSchedule,
          schedule: settings.schedule,
          afterHours: settings.afterHours,
          lunchHours: settings.lunchHours,
          holidays: settings.holidays,
          customMessage: settings.customMessage
        }
      });
      
      // Refresh agent status
      await getAgentStatus();
      
      // Close the dialog after successful save
      onClose();
    } catch (error) {
      console.error('Error saving AI agent settings:', error);
      setSaveError('Failed to save settings. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">AI Voice Agent Settings</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Enable AI Voice Agent</h3>
              <p className="text-sm text-gray-500">Allow AI to handle incoming calls</p>
            </div>
            <Toggle
              checked={settings.enabled}
              onChange={(checked) => setSettings(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          {/* Automatic Handling */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Automatic Call Handling</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">After Hours</span>
                <Toggle
                  checked={settings.afterHours}
                  onChange={(checked) => setSettings(prev => ({ ...prev, afterHours: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Lunch Hours</span>
                <Toggle
                  checked={settings.lunchHours}
                  onChange={(checked) => setSettings(prev => ({ ...prev, lunchHours: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Holidays</span>
                <Toggle
                  checked={settings.holidays}
                  onChange={(checked) => setSettings(prev => ({ ...prev, holidays: checked }))}
                />
              </div>
            </div>
          </div>

          {/* Custom Schedule */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Custom Schedule</h3>
              <Toggle
                checked={settings.customSchedule}
                onChange={(checked) => setSettings(prev => ({ ...prev, customSchedule: checked }))}
              />
            </div>
            {settings.customSchedule && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(settings.schedule).map(([day, hours]) => (
                  <div key={day} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize">{day}</span>
                    </div>
                    <div className="flex gap-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Start</label>
                        <input
                          type="time"
                          value={hours.start}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            schedule: {
                              ...prev.schedule,
                              [day]: { ...hours, start: e.target.value }
                            }
                          }))}
                          className="px-2 py-1 border border-gray-200 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">End</label>
                        <input
                          type="time"
                          value={hours.end}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            schedule: {
                              ...prev.schedule,
                              [day]: { ...hours, end: e.target.value }
                            }
                          }))}
                          className="px-2 py-1 border border-gray-200 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Voice Selection */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Voice Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {voiceOptions.map((voice) => (
                <div
                  key={voice.voiceId}
                  onClick={() => setSettings(prev => ({ ...prev, voiceId: voice.voiceId }))}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    settings.voiceId === voice.voiceId
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{voice.name}</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      {voice.gender}
                    </span>
                  </div>
                  {voice.preview && (
                    <button className="text-xs text-blue-600 flex items-center">
                      <Icons.Play className="w-3 h-3 mr-1" /> Listen
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Custom Message Request</h3>
            <div className="space-y-2">
              <textarea
                value={settings.customMessage}
                onChange={(e) => setSettings(prev => ({ ...prev, customMessage: e.target.value }))}
                placeholder="Describe your custom message requirements for the AI agent..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg h-32 resize-none"
              />
              <p className="text-sm text-gray-500">
                Your request will be sent to Ngenius support for review and implementation.
              </p>
            </div>
          </div>
        </div>

        {/* Status Information */}
        {(retellLoading || retellError) && (
          <div className={`mx-6 mb-6 p-4 rounded-lg ${
            retellError ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'
          }`}>
            {retellLoading && (
              <div className="flex items-center">
                <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Loading agent configuration...</span>
              </div>
            )}
            {retellError && (
              <div className="flex items-center">
                <Icons.AlertCircle className="w-4 h-4 mr-2" />
                <span>Error loading agent configuration</span>
              </div>
            )}
          </div>
        )}

        {/* Save Error Display */}
        {saveError && (
          <div className="mx-6 mb-6 p-4 bg-red-50 text-red-800 rounded-lg">
            <div className="flex items-center">
              <Icons.AlertCircle className="w-4 h-4 mr-2" />
              <span>{saveError}</span>
            </div>
          </div>
        )}

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveLoading}
            className="relative"
          >
            {saveLoading ? (
              <>
                <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : 'Save Changes'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};