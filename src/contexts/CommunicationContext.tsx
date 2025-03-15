import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for communication requests
export interface SendSMSRequest {
  to: string;
  message: string;
  from?: string;
}

export interface InitiateCallRequest {
  to: string;
  from?: string;
  callerType: 'prospect' | 'patient' | 'staff';
}

// Define the context shape
interface CommunicationContextType {
  sendSMS: (request: SendSMSRequest) => Promise<void>;
  sendBatchSMS: (to: string[], message: string) => Promise<void>;
  initiateCall: (request: InitiateCallRequest) => Promise<void>;
  isSending: boolean;
  isCalling: boolean;
  error: string | null;
}

// Create the context with a default value
const CommunicationContext = createContext<CommunicationContextType>({
  sendSMS: async () => {},
  sendBatchSMS: async () => {},
  initiateCall: async () => {},
  isSending: false,
  isCalling: false,
  error: null
});

// Create a provider component
interface CommunicationProviderProps {
  children: ReactNode;
}

export const CommunicationProvider: React.FC<CommunicationProviderProps> = ({ children }) => {
  const [isSending, setIsSending] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset error when component unmounts
  useEffect(() => {
    return () => {
      setError(null);
    };
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

  // Initiate a call
  const initiateCall = async (request: InitiateCallRequest) => {
    setIsCalling(true);
    setError(null);
    
    try {
      // In a real implementation, you would call an API endpoint
      console.log('Initiating call:', request);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // API call successful
      console.log('Call initiated successfully');
    } catch (err) {
      console.error('Error initiating call:', err);
      setError('Failed to initiate call. Please try again.');
      throw err;
    } finally {
      setIsCalling(false);
    }
  };

  // Provide the context value
  const contextValue: CommunicationContextType = {
    sendSMS,
    sendBatchSMS,
    initiateCall,
    isSending,
    isCalling,
    error
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