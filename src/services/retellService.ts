import { api } from '../utils/api';

export interface RetellCallParams {
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
  [key: string]: any; // Add index signature to make it compatible with Record<string, unknown>
}

export interface RetellAgentConfig {
  name?: string;
  voiceId?: string;
  llmConfig?: {
    provider?: string;
    model?: string;
    temperature?: number;
    systemPrompt?: string;
    [key: string]: any;
  };
  useCase?: string;
  parameters?: {
    [key: string]: any;
  };
}

// The API response from Netlify Functions already has the data at the top level
// No wrapper object with a data property is used

export interface RetellCallResponse {
  callId: string;
  status: string;
}

export interface RetellAgentResponse {
  id: string;
  status: string;
  config?: RetellAgentConfig;
}

export interface RetellAnalyticsParams {
  campaignId?: string;
  agentId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface RetellAnalyticsResponse {
  total: number;
  inProgress: number;
  averageDuration: number;
  calls: RetellCall[];
}

export interface RetellCall {
  call_id: string;
  agent_id: string;
  to_phone: string;
  from_phone: string;
  status: string;
  duration?: number;
  created_at: string;
  updated_at: string;
  metadata?: any;
}

export interface RetellCallDetails extends RetellCall {
  transcript?: {
    turns: {
      speaker: string;
      text: string;
      timestamp: string;
    }[];
  };
  recording?: {
    url: string;
    duration: number;
  };
}

/**
 * Service for interacting with RetellAI API via Netlify Functions
 */
export const retellService = {
  /**
   * Initiate a call with RetellAI
   */
  initiateCall: async (params: RetellCallParams): Promise<RetellCallResponse> => {
    const response = await api.post('/retell/call', params);
    return response.data;
  },

  /**
   * Get the status of the RetellAI agent
   */
  getAgentStatus: async (agentId?: string): Promise<RetellAgentResponse> => {
    const queryParams = agentId ? `?agentId=${agentId}` : '';
    const response = await api.get(`/retell/agent/status${queryParams}`);
    return response.data;
  },

  /**
   * Update the configuration of the RetellAI agent
   */
  updateAgentConfig: async (config: RetellAgentConfig, agentId?: string): Promise<RetellAgentResponse> => {
    const payload = {
      ...config,
      agentId
    };
    const response = await api.put('/retell/agent/config', payload);
    return response.data;
  },

  /**
   * Get call analytics with optional filters
   */
  getCallAnalytics: async (params: RetellAnalyticsParams = {}): Promise<RetellAnalyticsResponse> => {
    const queryParams = new URLSearchParams();
    if (params.campaignId) queryParams.append('campaignId', params.campaignId);
    if (params.agentId) queryParams.append('agentId', params.agentId);
    if (params.status) queryParams.append('status', params.status);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await api.get(`/retell/analytics${query}`);
    return response.data;
  },

  /**
   * Get details for a specific call
   */
  getCallDetails: async (callId: string): Promise<RetellCallDetails> => {
    const response = await api.get(`/retell/analytics/${callId}`);
    return response.data;
  }
};

export default retellService;
