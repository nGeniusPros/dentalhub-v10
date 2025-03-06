import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Toggle } from '../../../../../components/ui/toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../../components/ui/tabs';
import type { ReactNode } from 'react';
import { useCommunication } from '../../../../../contexts/CommunicationContext';
import { SdrAgent } from '../../../../../ai/sdr';
import {
  CampaignType,
  Prospect,
  CampaignConfig,
  WeeklySchedule
} from '../../../../../ai/sdr/interfaces/campaign.interfaces';

interface SDRAgentSettingsProps {
  open: boolean;
  onClose: () => void;
}

export const SDRAgentSettings: React.FC<SDRAgentSettingsProps> = ({
  open,
  onClose
}) => {
  const { retellLoading, agentStatus, retellError } = useCommunication();
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  
  // General settings
  const [settings, setSettings] = useState<CampaignConfig>({
    enabled: true,
    officeName: "Bright Smile Dental",
    customSchedule: false,
    schedule: {
      monday: { start: '9:00', end: '17:00' },
      tuesday: { start: '9:00', end: '17:00' },
      wednesday: { start: '9:00', end: '17:00' },
      thursday: { start: '9:00', end: '17:00' },
      friday: { start: '9:00', end: '17:00' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: '00:00', end: '00:00' }
    },
    voiceId: 'alloy'
  });

  // Campaign settings
  const [activeCampaign, setActiveCampaign] = useState<CampaignType>('leadGeneration');
  const [campaignEnabled, setCampaignEnabled] = useState<Record<CampaignType, boolean>>({
    leadGeneration: true,
    noResponse: true,
    noShow: true,
    reEngagement: true,
    listValidation: true,
    coldOffer: true,
    powerHour: true,
    holding: true
  });
  
  // Agent instance for preview
  const [agent] = useState(() => new SdrAgent(settings));

  // Campaign descriptions
  const campaignDescriptions: Record<CampaignType, string> = {
    leadGeneration: 'For new leads who filled out a form or showed initial interest',
    noResponse: 'For leads who didn\'t respond to the initial outreach',
    noShow: 'For leads who booked but didn\'t show up for their appointment',
    reEngagement: 'For leads who haven\'t engaged in a while',
    listValidation: 'For validating contact information from cold lists',
    coldOffer: 'For prospects from cold lists who have been validated',
    powerHour: 'For intense follow-up with selected holding prospects',
    holding: 'Simple storage campaign for inactive prospects'
  };

  // Initialize settings from agent status when component mounts
  useEffect(() => {
    if (agentStatus) {
      const agentRecord = agentStatus as Record<string, unknown>;
      setSettings(prev => ({
        ...prev,
        voiceId: (agentRecord.voice_id as string) || 'alloy',
        enabled: true, // Default to enabled if we have an agent
        officeName: (agentRecord.office_name as string) || "Bright Smile Dental"
      }));
    }
  }, [agentStatus]);
  
  const handleSave = async () => {
    setSaveLoading(true);
    setSaveError(null);
    
    try {
      // In a real implementation, you would call your API to update the SDR agent config
      console.log('Saving SDR agent settings:', {
        general: settings,
        campaigns: {
          activeCampaign,
          enabled: campaignEnabled
        }
      });
      
      // Example of how you would update the agent in a real implementation:
      /*
      await communicationService.sdr.updateAgentConfig({
        officeName: settings.officeName,
        voiceId: settings.voiceId,
        customSchedule: settings.customSchedule,
        schedule: settings.schedule,
        campaigns: {
          activeCampaign,
          enabled: campaignEnabled
        }
      });
      */
      
      // Close the dialog after successful save
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error saving SDR agent settings:', error);
      setSaveError('Failed to save settings. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  // Activate Power Hour campaign with specified number of prospects
  const handleActivatePowerHour = () => {
    const count = 25; // Default to 25 prospects
    console.log(`Activating Power Hour campaign for ${count} prospects`);
    // In a real implementation:
    // agent.activatePowerHour(count);
  };

  // Process no-shows to move them to the appropriate campaign
  const handleProcessNoShows = () => {
    console.log('Processing no-shows');
    // In a real implementation:
    // agent.processNoShows();
  };

  // Preview a campaign message
  const previewCampaignMessage = (campaignType: CampaignType, messageIndex: number = 0): string => {
    const campaign = agent.getCampaignManager().campaigns[campaignType];
    if (!campaign || !campaign.automationEvents || campaign.automationEvents.length === 0) {
      return 'No messages available for this campaign.';
    }
    
    const event = campaign.automationEvents[messageIndex];
    if (!event) {
      return 'No message found at specified index.';
    }
    
    // Create a sample prospect for personalization
    const sampleProspect: Prospect = {
      id: 'preview_prospect',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+15551234567',
      source: 'preview'
    };
    
    // Personalize the message
    let message = event.message;
    message = message.replace(/{{FirstName}}/g, sampleProspect.firstName);
    message = message.replace(/{{OfficeName}}/g, settings.officeName || "Bright Smile Dental");
    message = message.replace(/{{wooai}}/g, "tomorrow at 2pm, 3pm, or 4pm");
    message = message.replace(/{{AssigneeFirstName}}/g, "Dr. Smith");
    message = message.replace(/{{AssigneeFullName}}/g, "Dr. Jane Smith");
    message = message.replace(/{{AccountPhoneNumber}}/g, "(555) 123-4567");
    
    return message;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">SDR Agent Settings</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-gray-500 mt-1">
            Configure your automated Sales Development Representative to handle all prospecting communications.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="general">General Settings</TabsTrigger>
              <TabsTrigger value="campaigns">Campaign Configuration</TabsTrigger>
              <TabsTrigger value="actions">Manual Actions</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="general" className="p-6 space-y-6">
            {/* Main Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Enable SDR Agent</h3>
                <p className="text-sm text-gray-500">
                  Let the AI handle all prospecting communications
                </p>
              </div>
              <Toggle
                checked={settings.enabled}
                onChange={(checked) => setSettings(prev => ({ ...prev, enabled: checked }))}
              />
            </div>

            {/* Practice Name */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Practice Information</h3>
              <div className="space-y-2">
                <label className="block text-sm text-gray-700">Practice Name</label>
                <input
                  type="text"
                  value={settings.officeName?.toString() || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, officeName: e.target.value }))}
                  placeholder="Your Dental Practice Name"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
                <p className="text-xs text-gray-500">
                  This name will be used in all automated communications.
                </p>
              </div>
            </div>

            {/* Custom Schedule */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Business Hours</h3>
                <Toggle
                  checked={settings.customSchedule}
                  onChange={(checked) => setSettings(prev => ({ ...prev, customSchedule: checked }))}
                />
              </div>
              {settings.customSchedule && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(settings.schedule || {}).map(([day, hours]) => (
                    <div key={day} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium capitalize">{day}</span>
                      </div>
                      <div className="flex gap-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Open</label>
                          <input
                            type="time"
                            value={hours?.start || ''}
                            onChange={(e) => setSettings(prev => {
                              const newSchedule = {...prev.schedule} as WeeklySchedule;
                              if (newSchedule) {
                                newSchedule[day] = {
                                  start: e.target.value,
                                  end: hours?.end || '17:00'
                                };
                              }
                              return { ...prev, schedule: newSchedule };
                            })}
                            className="px-2 py-1 border border-gray-200 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Close</label>
                          <input
                            type="time"
                            value={hours?.end || ''}
                            onChange={(e) => setSettings(prev => {
                              const newSchedule = {...prev.schedule} as WeeklySchedule;
                              if (newSchedule) {
                                newSchedule[day] = {
                                  start: hours?.start || '09:00',
                                  end: e.target.value
                                };
                              }
                              return { ...prev, schedule: newSchedule };
                            })}
                            className="px-2 py-1 border border-gray-200 rounded text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Voice Settings */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Voice Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'].map(voiceId => (
                  <div
                    key={voiceId}
                    onClick={() => setSettings(prev => ({ ...prev, voiceId }))}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      settings.voiceId === voiceId
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{voiceId}</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                        {['echo', 'fable', 'onyx'].includes(voiceId) ? 'male' : 
                          ['nova', 'shimmer'].includes(voiceId) ? 'female' : 'neutral'}
                      </span>
                    </div>
                    <button className="text-xs text-blue-600 flex items-center">
                      <Icons.Play className="w-3 h-3 mr-1" /> Listen
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="p-6 space-y-6">
            {/* Campaign Selection */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Available Campaigns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(campaignDescriptions).map(([campaign, description]) => (
                  <div
                    key={campaign}
                    onClick={() => setActiveCampaign(campaign as CampaignType)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      activeCampaign === campaign
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{campaign.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                      <Toggle
                        checked={campaignEnabled[campaign as CampaignType]}
                        onChange={(checked) => {
                          setCampaignEnabled(prev => ({
                            ...prev,
                            [campaign]: checked
                          }));
                          // Don't propagate to the parent div
                          event?.stopPropagation();
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">{description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Preview */}
            {activeCampaign && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium text-gray-900">Campaign Preview</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Sample Message</h4>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-sm">{previewCampaignMessage(activeCampaign)}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    This is a sample message from the {activeCampaign.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} campaign.
                    Messages will be personalized for each prospect.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="actions" className="p-6 space-y-6">
            {/* Manual Actions */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Campaign Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <h4 className="font-medium mb-1">Activate Power Hour</h4>
                      <p className="text-sm text-gray-500">
                        Move prospects from the holding campaign to receive high-priority follow-up.
                      </p>
                    </div>
                    <Button onClick={handleActivatePowerHour} className="mt-4">
                      <Icons.Zap className="w-4 h-4 mr-2" /> Activate Power Hour
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <h4 className="font-medium mb-1">Process No-Shows</h4>
                      <p className="text-sm text-gray-500">
                        Identify prospects who missed appointments and move them to the no-show campaign.
                      </p>
                    </div>
                    <Button onClick={handleProcessNoShows} className="mt-4">
                      <Icons.ClipboardList className="w-4 h-4 mr-2" /> Process No-Shows
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium text-gray-900">Campaign Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Active Prospects</p>
                  <p className="text-2xl font-semibold">127</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Appointments Booked</p>
                  <p className="text-2xl font-semibold">42</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-semibold">33%</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

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