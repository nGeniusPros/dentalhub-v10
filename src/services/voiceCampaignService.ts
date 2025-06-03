import { api } from '../utils/api';

export interface CallAnalyticsParams {
  campaignId?: string;
  agentId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface StartCallData {
  agentId: string;
  phoneNumber: string;
  userPhoneNumber: string;
  campaignId?: string;
  metadata?: Record<string, unknown>;
  maxDuration?: number;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'recall' | 'reactivation' | 'treatment' | 'appointment' | 'event' | 'custom';
  status: 'active' | 'scheduled' | 'completed' | 'paused';
  targetCount: number;
  completedCalls: number;
  successRate: number;
  scheduledDate?: string;
  lastRun?: string;
  schedule?: {
    startDate: string;
    startTime: string;
    maxAttempts: number;
    timeBetweenAttempts: number;
  };
}

/**
 * Start a new outbound call using Retell AI
 */
export const startCall = async (callData: StartCallData) => {
  try {
    const response = await api.post('retell/start-call', callData);
    return response;
  } catch (error) {
    console.error('Failed to start call:', error);
    throw new Error(error.response?.data?.error || 'Failed to start call');
  }
};

/**
 * Get call analytics and statistics
 */
export const getCallAnalytics = async (params: CallAnalyticsParams = {}) => {
  try {
    const response = await api.get('retell/get-call-analytics', params);
    return response;
  } catch (error) {
    console.error('Failed to fetch call analytics:', error);
    throw new Error('Failed to fetch call analytics');
  }
};

/**
 * Get list of voice campaigns
 */
export const getCampaigns = async (): Promise<Campaign[]> => {
  try {
    const response = await api.get<Campaign[]>('campaigns');
    return response;
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    throw new Error('Failed to fetch campaigns');
  }
};

/**
 * Create a new voice campaign
 */
export const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'status' | 'completedCalls' | 'successRate'>) => {
  try {
    const response = await api.post<Campaign>('campaigns', {
      ...campaignData,
      status: 'active',
      completedCalls: 0,
      successRate: 0,
    });
    return response;
  } catch (error) {
    console.error('Failed to create campaign:', error);
    throw new Error('Failed to create campaign');
  }
};

/**
 * Update campaign status
 */
export const updateCampaignStatus = async (campaignId: string, status: Campaign['status']) => {
  try {
    const response = await api.put(`campaigns/${campaignId}/status`, { status });
    return response;
  } catch (error) {
    console.error('Failed to update campaign status:', error);
    throw new Error('Failed to update campaign status');
  }
};

/**
 * Delete a campaign
 */
export const deleteCampaign = async (campaignId: string) => {
  try {
    await api.delete(`campaigns/${campaignId}`);
  } catch (error) {
    console.error('Failed to delete campaign:', error);
    throw new Error('Failed to delete campaign');
  }
};
