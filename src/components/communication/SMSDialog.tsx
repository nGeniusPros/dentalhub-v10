import React, { useState } from 'react';
import { useCommunication } from '../../contexts/CommunicationContext';

interface SMSDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientPhone?: string;
  patientName?: string;
}

export const SMSDialog: React.FC<SMSDialogProps> = ({
  isOpen,
  onClose,
  patientPhone = '',
  patientName = '',
}) => {
  const [phoneNumber, setPhoneNumber] = useState(patientPhone);
  const [message, setMessage] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [sendStatus, setSendStatus] = useState<string | null>(null);
  
  const { sendSMS, messageLoading, messageError } = useCommunication();
  
  // Template messages for quick selection
  const messageTemplates = [
    {
      title: 'Appointment Reminder',
      text: `Hi ${patientName || '[Patient]'}, this is a reminder about your upcoming dental appointment on [Date] at [Time]. Please reply CONFIRM to confirm or call us at (555) 123-4567 to reschedule.`
    },
    {
      title: 'Appointment Confirmation',
      text: `Hi ${patientName || '[Patient]'}, your dental appointment has been confirmed for [Date] at [Time]. We look forward to seeing you!`
    },
    {
      title: 'Follow-up Care',
      text: `Hi ${patientName || '[Patient]'}, following your recent dental procedure, we recommend [care instructions]. Please call us if you have any questions or concerns.`
    }
  ];
  
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };
  
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  
  const handleMediaUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMediaUrl(e.target.value);
  };
  
  const selectTemplate = (templateText: string) => {
    setMessage(templateText);
  };
  
  const handleSendSMS = async () => {
    if (!phoneNumber || !message) {
      alert('Please enter both a phone number and message');
      return;
    }
    
    setSendStatus('Sending message...');
    
    try {
      const response = await sendSMS({
        to: phoneNumber,
        body: message,
        mediaUrl: mediaUrl || undefined
      });
      
      const typedResponse = response as { messageSid: string; status: string };
      setSendStatus(`Message sent successfully! SID: ${typedResponse.messageSid}`);
      
      // Reset form after successful send
      setMessage('');
      setMediaUrl('');
      
      // Close the dialog after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error sending SMS:', error);
      setSendStatus(`Failed to send message: ${messageError?.message || 'Unknown error'}`);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Send SMS Message</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Recipient Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="+1 (555) 123-4567"
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            value={message}
            onChange={handleMessageChange}
            placeholder="Type your message here..."
            rows={4}
            className="w-full p-2 border rounded resize-none"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Media URL (Optional)</label>
          <input
            type="url"
            value={mediaUrl}
            onChange={handleMediaUrlChange}
            placeholder="https://example.com/image.jpg"
            className="w-full p-2 border rounded"
          />
          <p className="text-xs text-gray-500 mt-1">
            Add an image or document URL to attach to your SMS
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Quick Templates</label>
          <div className="space-y-2">
            {messageTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => selectTemplate(template.text)}
                className="block w-full text-left p-2 border rounded text-sm hover:bg-gray-50"
              >
                <span className="font-medium">{template.title}</span>
                <span className="block text-gray-500 truncate">{template.text.substring(0, 50)}...</span>
              </button>
            ))}
          </div>
        </div>
        
        {sendStatus && (
          <div className={`mb-4 p-3 rounded-md ${
            sendStatus.includes('Failed') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'
          }`}>
            <p>{sendStatus}</p>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSendSMS}
            disabled={messageLoading || !phoneNumber || !message}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-300"
          >
            {messageLoading ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SMSDialog;