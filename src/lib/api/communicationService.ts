import axios from 'axios';

// Define the API base URL - this should match your backend server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Define types
export interface SendSMSRequest {
  to: string;
  body: string;
  mediaUrl?: string;
}

export interface InitiateCallRequest {
  to: string;
  from?: string;
  options?: Record<string, unknown>;
}

export interface RetellCallRequest {
  phoneNumber: string;
  callerId?: string;
  patientInfo?: {
    name: string;
    id: string;
    lastVisit?: string;
    nextAppointment?: string;
    [key: string]: unknown;
  };
  appointmentContext?: {
    date?: string;
    time?: string;
    provider?: string;
    type?: string;
    [key: string]: unknown;
  };
}

// Create a configured axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// SMS API calls
export const smsApi = {
  // Send an SMS message
  sendSMS: async (request: SendSMSRequest) => {
    try {
      const response = await api.post('/twilio/sms/send', request);
      return response.data;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  },

  // Send batch SMS messages
  sendBatchSMS: async (recipients: string[], body: string, mediaUrl?: string) => {
    try {
      const response = await api.post('/twilio/sms/batch', {
        recipients,
        body,
        mediaUrl,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending batch SMS:', error);
      throw error;
    }
  },

  // Get SMS history (this would connect to your backend which would fetch from Twilio)
  getSMSHistory: async (phoneNumber?: string) => {
    try {
      const params = phoneNumber ? { phoneNumber } : {};
      const response = await api.get('/twilio/sms/history', { params });
      return response.data;
    } catch (error) {
      console.error('Error getting SMS history:', error);
      throw error;
    }
  }
};

// Voice API calls
export const voiceApi = {
  // Initiate a phone call
  initiateCall: async (request: InitiateCallRequest) => {
    try {
      const response = await api.post('/twilio/voice/call', request);
      return response.data;
    } catch (error) {
      console.error('Error initiating call:', error);
      throw error;
    }
  },

  // Get call history (this would connect to your backend which would fetch from Twilio)
  getCallHistory: async (phoneNumber?: string) => {
    try {
      const params = phoneNumber ? { phoneNumber } : {};
      const response = await api.get('/twilio/voice/history', { params });
      return response.data;
    } catch (error) {
      console.error('Error getting call history:', error);
      throw error;
    }
  }
};

// Retell AI API calls
export const retellApi = {
  // Initiate a call with a Retell AI voice agent
  initiateRetellCall: async (request: RetellCallRequest) => {
    try {
      const response = await api.post('/retell/call', request);
      return response.data;
    } catch (error) {
      console.error('Error initiating Retell call:', error);
      throw error;
    }
  },

  // Get Retell AI agent status
  getAgentStatus: async () => {
    try {
      const response = await api.get('/retell/agent/status');
      return response.data;
    } catch (error) {
      console.error('Error getting Retell agent status:', error);
      throw error;
    }
  },

  // Update Retell AI agent configuration
  updateAgentConfig: async (config: Record<string, unknown>) => {
    try {
      const response = await api.put('/retell/agent/config', config);
      return response.data;
    } catch (error) {
      console.error('Error updating Retell agent config:', error);
      throw error;
    }
  }
};

export default {
  sms: smsApi,
  voice: voiceApi,
  retell: retellApi
};