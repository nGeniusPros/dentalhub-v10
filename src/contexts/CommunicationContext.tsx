import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { retellService, RetellCallParams, RetellAgentConfig, RetellAgentResponse, RetellAnalyticsParams, RetellAnalyticsResponse, RetellCallDetails } from '../services/retellService';

// Define types for communication requests
export interface SendSMSRequest {
  to: string;
  message: string;
  from?: string;
}

export interface InitiateCallRequest {
  phoneNumber: string;
  callerId?: string;
  patientInfo?: {
    name?: string;
    id?: string;
    history?: string;
    [key: string]: any;
  };
  appointmentContext?: {
    date?: string;
    time?: string;
    type?: string;
    notes?: string;
    [key: string]: any;
  };
}

// Define the context shape
interface CommunicationContextType {
  sendSMS: (request: SendSMSRequest) => Promise<void>;
  sendBatchSMS: (to: string[], message: string) => Promise<void>;
  initiateCall: (request: InitiateCallRequest) => Promise<void>;
  getAgentStatus: (agentId?: string) => Promise<RetellAgentResponse>;
  updateAgentConfig: (config: RetellAgentConfig, agentId?: string) => Promise<RetellAgentResponse>;
  getCallAnalytics: (params?: RetellAnalyticsParams) => Promise<RetellAnalyticsResponse>;
  getCallDetails: (callId: string) => Promise<RetellCallDetails>;
  isSending: boolean;
  isCalling: boolean;
  retellLoading: boolean;
  agentStatus: RetellAgentResponse | null;
  callAnalytics: RetellAnalyticsResponse | null;
  error: string | null;
  retellError: string | null;
}

// Create the context with a default value
const CommunicationContext = createContext<CommunicationContextType>({
  sendSMS: async () => {},
  sendBatchSMS: async () => {},
  initiateCall: async () => {},
  getAgentStatus: async () => ({ id: '', status: '' }),
  updateAgentConfig: async () => ({ id: '', status: '' }),
  getCallAnalytics: async () => ({ total: 0, inProgress: 0, averageDuration: 0, calls: [] }),
  getCallDetails: async () => ({ id: '', status: '', duration: 0, startTime: '' }),
  isSending: false,
  isCalling: false,
  retellLoading: false,
  agentStatus: null,
  callAnalytics: null,
  error: null,
  retellError: null
});

// Create a provider component
interface CommunicationProviderProps {
  children: ReactNode;
}

export const CommunicationProvider: React.FC<CommunicationProviderProps> = ({ children }) => {
  const [isSending, setIsSending] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [retellLoading, setRetellLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState<RetellAgentResponse | null>(null);
  const [callAnalytics, setCallAnalytics] = useState<RetellAnalyticsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retellError, setRetellError] = useState<string | null>(null);

  // Reset error when component unmounts
  useEffect(() => {
    return () => {
      setError(null);
      setRetellError(null);
    };
  }, []);

  // Fetch agent status on mount
  useEffect(() => {
    const fetchAgentStatus = async () => {
      try {
        setRetellLoading(true);
        const status = await retellService.getAgentStatus();
        setAgentStatus(status);
      } catch (err) {
        console.error('Error fetching agent status:', err);
        setRetellError('Failed to fetch agent status. Please try again.');
      } finally {
        setRetellLoading(false);
      }
    };

    fetchAgentStatus();
  }, []);

  // Send a single SMS
  const sendSMS = async (request: SendSMSRequest) => {
    setIsSending(true);
    setError(null);

    try {
      // In a real implementation, you would call an API endpoint
      console.log('Sending SMS:', request);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // API call successful
      console.log('SMS sent successfully');
    } catch (err) {
      console.error('Error sending SMS:', err);
      setError('Failed to send SMS. Please try again.');
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  // Send batch SMS to multiple recipients
  const sendBatchSMS = async (to: string[], message: string) => {
    setIsSending(true);
    setError(null);

    try {
      // In a real implementation, you would call an API endpoint
      console.log(`Sending batch SMS to ${to.length} recipients:`, { to, message });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // API call successful
      console.log('Batch SMS sent successfully');
    } catch (err) {
      console.error('Error sending batch SMS:', err);
      setError('Failed to send batch SMS. Please try again.');
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  // Initiate a call using RetellAI
  const initiateCall = async (request: InitiateCallRequest) => {
    setIsCalling(true);
    setError(null);

    try {
      // Call the RetellAI service to initiate a call
      const result = await retellService.initiateCall(request);
      console.log('Call initiated successfully:', result);
      return result;
    } catch (err) {
      console.error('Error initiating call:', err);
      setError('Failed to initiate call. Please try again.');
      throw err;
    } finally {
      setIsCalling(false);
    }
  };

  // Get RetellAI agent status
  const getAgentStatus = async (agentId?: string) => {
    setRetellLoading(true);
    setRetellError(null);

    try {
      const status = await retellService.getAgentStatus(agentId);
      setAgentStatus(status);
      return status;
    } catch (err) {
      console.error('Error getting agent status:', err);
      setRetellError('Failed to get agent status. Please try again.');
      throw err;
    } finally {
      setRetellLoading(false);
    }
  };

  // Update RetellAI agent configuration
  const updateAgentConfig = async (config: RetellAgentConfig, agentId?: string) => {
    setRetellLoading(true);
    setRetellError(null);

    try {
      const updatedStatus = await retellService.updateAgentConfig(config, agentId);
      setAgentStatus(updatedStatus);
      return updatedStatus;
    } catch (err) {
      console.error('Error updating agent config:', err);
      setRetellError('Failed to update agent configuration. Please try again.');
      throw err;
    } finally {
      setRetellLoading(false);
    }
  };

  // Get RetellAI call analytics
  const getCallAnalytics = async (params: RetellAnalyticsParams = {}) => {
    setRetellLoading(true);
    setRetellError(null);

    try {
      const analytics = await retellService.getCallAnalytics(params);
      setCallAnalytics(analytics);
      return analytics;
    } catch (err) {
      console.error('Error getting call analytics:', err);
      setRetellError('Failed to get call analytics. Please try again.');
      throw err;
    } finally {
      setRetellLoading(false);
    }
  };

  // Get RetellAI call details
  const getCallDetails = async (callId: string) => {
    setRetellLoading(true);
    setRetellError(null);

    try {
      const details = await retellService.getCallDetails(callId);
      return details;
    } catch (err) {
      console.error('Error getting call details:', err);
      setRetellError('Failed to get call details. Please try again.');
      throw err;
    } finally {
      setRetellLoading(false);
    }
  };

  // Provide the context value
  const contextValue: CommunicationContextType = {
    sendSMS,
    sendBatchSMS,
    initiateCall,
    getAgentStatus,
    updateAgentConfig,
    getCallAnalytics,
    getCallDetails,
    isSending,
    isCalling,
    retellLoading,
    agentStatus,
    callAnalytics,
    error,
    retellError
  };

  return (
    <CommunicationContext.Provider value={contextValue}>
      {children}
    </CommunicationContext.Provider>
  );
};

// Create a custom hook for using the communication context
export const useCommunication = () => {
  const context = useContext(CommunicationContext);
  
  if (!context) {
    throw new Error('useCommunication must be used within a CommunicationProvider');
  }
  
  return context;
};