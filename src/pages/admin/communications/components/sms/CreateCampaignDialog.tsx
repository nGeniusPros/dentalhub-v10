import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { useCommunication } from '../../../../../contexts/CommunicationContext';

interface CreateCampaignDialogProps {
  open: boolean;
  onClose: () => void;
}

interface CampaignFormData {
  name: string;
  message: string;
  audience: string;
  scheduleDate: string;
  scheduleTime: string;
}

export const CreateCampaignDialog: React.FC<CreateCampaignDialogProps> = ({
  open,
  onClose
}) => {
  const { sendBatchSMS, messageLoading } = useCommunication();
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    message: '',
    audience: '',
    scheduleDate: '',
    scheduleTime: ''
  });
  const [createStatus, setCreateStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.message || !formData.audience) {
      setCreateStatus({
        type: 'error',
        message: 'Please fill in all required fields'
      });
      return;
    }
    
    try {
      setCreateStatus({ type: null, message: '' });
      
      // In a real implementation, you would get actual recipient phone numbers
      // based on the selected audience
      const mockRecipients = getMockRecipientsForAudience(formData.audience);
      
      // Call Twilio SMS API through our communication context
      if (mockRecipients.length > 0) {
        await sendBatchSMS(mockRecipients, formData.message);
        
        setCreateStatus({
          type: 'success',
          message: `Campaign "${formData.name}" created successfully with ${mockRecipients.length} recipients`
        });
        
        // Reset form after successful creation
        setFormData({
          name: '',
          message: '',
          audience: '',
          scheduleDate: '',
          scheduleTime: ''
        });
        
        // Close dialog after a short delay
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setCreateStatus({
          type: 'error',
          message: 'No recipients found for the selected audience'
        });
      }
    } catch (error) {
      console.error('Error creating SMS campaign:', error);
      setCreateStatus({
        type: 'error',
        message: 'Failed to create campaign. Please try again.'
      });
    }
  };
  
  // Helper function to get mock recipients based on audience selection
  const getMockRecipientsForAudience = (audience: string): string[] => {
    // In a real implementation, this would query your database
    switch (audience) {
      case 'all':
        return ['+15551234567', '+15552345678', '+15553456789', '+15554567890'];
      case 'active':
        return ['+15551234567', '+15552345678'];
      case 'inactive':
        return ['+15553456789', '+15554567890'];
      case 'custom':
        return ['+15551234567'];
      default:
        return [];
    }
  };
  
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Create SMS Campaign</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Campaign Form */}
          <form className="space-y-6" onSubmit={handleCreateCampaign}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="Enter campaign name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message Template
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg h-32"
                placeholder="Enter your message"
              />
              <p className="mt-1 text-sm text-gray-500">
                Available variables: {'{patient_name}'}, {'{appointment_date}'}, {'{appointment_time}'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Audience
              </label>
              <select
                name="audience"
                value={formData.audience}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="">Select audience</option>
                <option value="all">All Patients</option>
                <option value="active">Active Patients</option>
                <option value="inactive">Inactive Patients</option>
                <option value="custom">Custom Segment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Schedule
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Date</label>
                  <input
                    type="date"
                    name="scheduleDate"
                    value={formData.scheduleDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Time</label>
                  <input
                    type="time"
                    name="scheduleTime"
                    value={formData.scheduleTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
            
            {/* Status Messages */}
            {createStatus.type && (
              <div className={`p-4 rounded-lg ${
                createStatus.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'
              }`}>
                <div className="flex items-center">
                  {createStatus.type === 'error' ? (
                    <Icons.AlertCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <Icons.CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  <span>{createStatus.message}</span>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateCampaign}
            disabled={messageLoading || !formData.name || !formData.message || !formData.audience}
          >
            {messageLoading ? (
              <>
                <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : 'Create Campaign'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};