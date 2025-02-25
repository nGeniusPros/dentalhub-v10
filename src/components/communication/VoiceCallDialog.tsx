import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useCommunication } from '../../contexts/CommunicationContext';

interface VoiceCallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientPhone?: string;
  patientName?: string;
}

export const VoiceCallDialog: React.FC<VoiceCallDialogProps> = ({
  isOpen,
  onClose,
  patientPhone = '',
  patientName = '',
}) => {
  const [phoneNumber, setPhoneNumber] = useState(patientPhone);
  const [callType, setCallType] = useState<'standard' | 'ai'>('standard');
  const [callStatus, setCallStatus] = useState<string | null>(null);
  const [callId, setCallId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'dialpad' | 'contacts'>('dialpad');
  const [callerId] = useState<string>('OC Smile Experts');
  const [callerPhone] = useState<string>('(877) 599-5209');
  
  const { 
    initiateCall, 
    initiateRetellCall, 
    callLoading, 
    callError 
  } = useCommunication();
  
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };
  
  const handleCallTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCallType(e.target.value as 'standard' | 'ai');
  };
  
  const appendToNumber = (digit: string) => {
    setPhoneNumber(prev => prev + digit);
  };
  
  const handleStartCall = async () => {
    if (!phoneNumber) {
      alert('Please enter a valid phone number');
      return;
    }
    
    setCallStatus('Initiating call...');
    
    try {
      if (callType === 'standard') {
        // Regular Twilio call
        const response = await initiateCall({
          to: phoneNumber
        });
        const typedResponse = response as { callSid: string; status: string };
        setCallId(typedResponse.callSid);
        setCallStatus(`Call initiated with SID: ${typedResponse.callSid}`);
      } else {
        // Retell AI call
        const response = await initiateRetellCall({
          phoneNumber,
          patientInfo: {
            name: patientName,
            id: '12345', // Replace with actual patient ID
            lastVisit: '2023-12-15', // Example date
            nextAppointment: '2023-02-28', // Example date
          },
          appointmentContext: {
            type: 'Cleaning',
            date: '2023-02-28',
            time: '14:00',
            provider: 'Dr. Smith'
          }
        });
        const typedResponse = response as { callId: string; status: string };
        setCallId(typedResponse.callId);
        setCallStatus(`AI call initiated with ID: ${typedResponse.callId}`);
      }
    } catch (error) {
      console.error('Error initiating call:', error);
      setCallStatus(`Call failed: ${callError?.message || 'Unknown error'}`);
    }
  };
  
  const handleEndCall = () => {
    // In a complete implementation, you would add logic to
    // terminate an in-progress call via the Twilio API
    setCallStatus('Call ended');
    setCallId(null);
    
    // Close the dialog after a short delay
    setTimeout(() => {
      onClose();
    }, 1500);
  };
  
  if (!isOpen) return null;
  
  // Dialpad component
  const renderDialpad = () => (
    <div className="dialpad grid grid-cols-3 gap-2 mb-4 mt-2">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(digit => (
        <button
          key={digit}
          onClick={() => appendToNumber(digit)}
          disabled={!!callId}
          className="rounded-full h-12 w-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 mx-auto"
        >
          {digit}
        </button>
      ))}
      <button 
        onClick={() => appendToNumber('+')}
        disabled={!!callId}
        className="rounded-full h-12 w-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 mx-auto"
      >
        +
      </button>
    </div>
  );
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {/* Header with tabs */}
        <div className="flex mb-4 border-b">
          <button
            onClick={() => setSelectedTab('dialpad')}
            className={`px-4 py-2 ${selectedTab === 'dialpad' ? 'border-b-2 border-blue-500' : ''}`}
          >
            <Icons.Phone className="w-5 h-5 mx-auto" />
          </button>
          <button
            onClick={() => setSelectedTab('contacts')}
            className={`px-4 py-2 ${selectedTab === 'contacts' ? 'border-b-2 border-blue-500' : ''}`}
          >
            <Icons.Users className="w-5 h-5 mx-auto" />
          </button>
        </div>
        
        {/* Caller ID display */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Caller ID</label>
          <div className="p-3 border rounded-md">
            <div className="font-medium">{callerId}</div>
            <div className="text-sm text-gray-600">{callerPhone}</div>
          </div>
        </div>
        
        {/* Call Type selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Call Type</label>
          <select
            value={callType}
            onChange={handleCallTypeChange}
            disabled={!!callId}
            className="w-full p-2 border rounded"
          >
            <option value="standard">Standard Call</option>
            <option value="ai">AI Assistant</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="+1 (555) 123-4567"
            disabled={!!callId}
            className="w-full p-2 border rounded"
          />
        </div>
        
        {selectedTab === 'dialpad' && renderDialpad()}
        
        {selectedTab === 'contacts' && (
          <div className="mb-4">
            <input
              type="search"
              placeholder="Search contacts..."
              className="w-full p-2 border rounded mb-2"
            />
            <div className="h-40 overflow-y-auto">
              <div 
                className="p-2 border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => setPhoneNumber('(714) 249-3095')}
              >
                <div className="font-medium">Michael Brady</div>
                <div className="text-sm text-gray-600">(714) 249-3095</div>
              </div>
            </div>
          </div>
        )}
        
        {callType === 'ai' && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>AI Assistant:</strong> The AI will call this patient to confirm their upcoming appointment and answer basic questions.
            </p>
          </div>
        )}
        
        {callStatus && (
          <div className={`mb-4 p-3 rounded-md ${
            callStatus.includes('failed') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'
          }`}>
            <p>{callStatus}</p>
          </div>
        )}
        
        <div className="flex justify-between space-x-3">
          {!callId ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleStartCall}
                disabled={callLoading || !phoneNumber}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
              >
                {callLoading ? 'Connecting...' : 'CALL'}
              </button>
            </>
          ) : (
            <button
              onClick={handleEndCall}
              className="w-full px-4 py-2 bg-red-600 text-white rounded"
            >
              End Call
            </button>
          )}
        </div>
        
        {/* Phone Calls section */}
        <div className="mt-4 pt-4 border-t">
          <button
            className="w-full text-center px-4 py-2 bg-blue-50 text-blue-700 rounded"
          >
            PHONE CALLS
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceCallDialog;