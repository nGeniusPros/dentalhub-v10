import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import communicationService, { 
  SendSMSRequest, 
  InitiateCallRequest,
  RetellCallRequest
} from '../lib/api/communicationService';

// Define call and message types for our state
interface CallRecord {
  id: string;
  to: string;
  from: string;
  status: string;
  direction: 'inbound' | 'outbound';
  duration?: number;
  startTime: string;
  endTime?: string;
  recording?: string;
  notes?: string;
}

interface MessageRecord {
  id: string;
  to: string;
  from: string;
  body: string;
  status: string;
  direction: 'inbound' | 'outbound';
  mediaUrl?: string;
  timestamp: string;
}

// Context interface
interface CommunicationContextType {
  // SMS state and functions
  messages: MessageRecord[];
  sendSMS: (request: SendSMSRequest) => Promise<unknown>;
  sendBatchSMS: (recipients: string[], body: string, mediaUrl?: string) => Promise<unknown>;
  messageLoading: boolean;
  messageError: Error | null;
  
  // Voice call state and functions
  calls: CallRecord[];
  initiateCall: (request: InitiateCallRequest) => Promise<unknown>;
  callLoading: boolean;
  callError: Error | null;
  
  // Retell AI state and functions
    initiateRetellCall: (request: RetellCallRequest) => Promise<unknown>;
    retellLoading: boolean;
    retellError: Error | null;
    agentStatus: Record<string, unknown> | null;
    
    // Utilities
    refreshCallHistory: () => Promise<void>;
    refreshMessageHistory: () => Promise<void>;
  }

// Create context with default values
const CommunicationContext = createContext<CommunicationContextType>({
  messages: [],
  sendSMS: async () => Promise.resolve(),
  sendBatchSMS: async () => Promise.resolve(),
  messageLoading: false,
  messageError: null,
  
  calls: [],
  initiateCall: async () => Promise.resolve(),
  callLoading: false,
  callError: null,
  
  initiateRetellCall: async () => Promise.resolve(),
  retellLoading: false,
  retellError: null,
  agentStatus: null,
  
  refreshCallHistory: async () => Promise.resolve(),
  refreshMessageHistory: async () => Promise.resolve(),
});

// Provider component
export const CommunicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State for SMS
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const [messageError, setMessageError] = useState<Error | null>(null);
  
  // State for calls
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [callLoading, setCallLoading] = useState(false);
  const [callError, setCallError] = useState<Error | null>(null);
  
  // State for Retell AI
  const [retellLoading, setRetellLoading] = useState(false);
  const [retellError, setRetellError] = useState<Error | null>(null);
  const [agentStatus, setAgentStatus] = useState<Record<string, unknown> | null>(null);
  
  // Load initial data
  useEffect(() => {
    refreshMessageHistory();
    refreshCallHistory();
    fetchAgentStatus();
  }, []);
  
  // SMS functions
  const sendSMS = async (request: SendSMSRequest) => {
    setMessageLoading(true);
    setMessageError(null);
    try {
      const response = await communicationService.sms.sendSMS(request);
      await refreshMessageHistory();
      return response;
    } catch (error) {
      setMessageError(error instanceof Error ? error : new Error('Failed to send SMS'));
      throw error;
    } finally {
      setMessageLoading(false);
    }
  };
  
  const sendBatchSMS = async (recipients: string[], body: string, mediaUrl?: string) => {
    setMessageLoading(true);
    setMessageError(null);
    try {
      const response = await communicationService.sms.sendBatchSMS(recipients, body, mediaUrl);
      await refreshMessageHistory();
      return response;
    } catch (error) {
      setMessageError(error instanceof Error ? error : new Error('Failed to send batch SMS'));
      throw error;
    } finally {
      setMessageLoading(false);
    }
  };
  
  const refreshMessageHistory = async () => {
    setMessageLoading(true);
    try {
      // For development, use mock data if the API isn't fully implemented
      if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
        // Mock message data
        const mockMessages: MessageRecord[] = [
          {
            id: '1',
            to: '+15551234567',
            from: '+15557654321',
            body: 'Your dental appointment is scheduled for tomorrow at 2:00 PM.',
            status: 'delivered',
            direction: 'outbound',
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            to: '+15557654321',
            from: '+15551234567',
            body: 'Thank you. I\'ll be there.',
            status: 'received',
            direction: 'inbound',
            timestamp: new Date().toISOString()
          }
        ];
        setMessages(mockMessages);
      } else {
        const response = await communicationService.sms.getSMSHistory();
        setMessages(response.messages);
      }
    } catch (error) {
      console.error('Error refreshing message history:', error);
    } finally {
      setMessageLoading(false);
    }
  };
  
  // Voice call functions
  const initiateCall = async (request: InitiateCallRequest) => {
    setCallLoading(true);
    setCallError(null);
    try {
      const response = await communicationService.voice.initiateCall(request);
      await refreshCallHistory();
      return response;
    } catch (error) {
      setCallError(error instanceof Error ? error : new Error('Failed to initiate call'));
      throw error;
    } finally {
      setCallLoading(false);
    }
  };
  
  const refreshCallHistory = async () => {
    setCallLoading(true);
    try {
      // For development, use mock data if the API isn't fully implemented
      if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
        // Mock call data
        const mockCalls: CallRecord[] = [
          {
            id: '1',
            to: '+15551234567',
            from: '+15557654321',
            status: 'completed',
            direction: 'outbound',
            duration: 120,
            startTime: new Date(Date.now() - 3600000).toISOString(),
            endTime: new Date(Date.now() - 3480000).toISOString()
          },
          {
            id: '2',
            to: '+15557654321',
            from: '+15551234567',
            status: 'completed',
            direction: 'inbound',
            duration: 180,
            startTime: new Date(Date.now() - 7200000).toISOString(),
            endTime: new Date(Date.now() - 7020000).toISOString()
          }
        ];
        setCalls(mockCalls);
      } else {
        const response = await communicationService.voice.getCallHistory();
        setCalls(response.calls);
      }
    } catch (error) {
      console.error('Error refreshing call history:', error);
    } finally {
      setCallLoading(false);
    }
  };
  
  // Retell AI functions
  const initiateRetellCall = async (request: RetellCallRequest) => {
    setRetellLoading(true);
    setRetellError(null);
    try {
      const response = await communicationService.retell.initiateRetellCall(request);
      await refreshCallHistory(); // Refresh to show the new call
      return response;
    } catch (error) {
      setRetellError(error instanceof Error ? error : new Error('Failed to initiate Retell call'));
      throw error;
    } finally {
      setRetellLoading(false);
    }
  };
  
  const fetchAgentStatus = async () => {
    try {
      // For development, use mock data if the API isn't fully implemented
      if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
        setAgentStatus({
          id: 'mock-agent-id',
          name: 'Dental Assistant (Mock)',
          status: 'active',
          voice_id: 'alloy',
          created_at: new Date().toISOString()
        });
      } else {
        const response = await communicationService.retell.getAgentStatus();
        setAgentStatus(response.agent);
      }
    } catch (error) {
      console.error('Error fetching Retell agent status:', error);
    }
  };
  
  // Provide context value
  const value = {
    // SMS
    messages,
    sendSMS,
    sendBatchSMS,
    messageLoading,
    messageError,
    refreshMessageHistory,
    
    // Voice call
    calls,
    initiateCall,
    callLoading,
    callError,
    refreshCallHistory,
    
    // Retell AI
    initiateRetellCall,
    retellLoading,
    retellError,
    agentStatus
  };
  
  return (
    <CommunicationContext.Provider value={value}>
      {children}
    </CommunicationContext.Provider>
  );
};

// Custom hook for using the communication context
export const useCommunication = () => {
  const context = useContext(CommunicationContext);
  if (context === undefined) {
    throw new Error('useCommunication must be used within a CommunicationProvider');
  }
  return context;
};

export default CommunicationContext;