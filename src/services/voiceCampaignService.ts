import { api } from '../utils/api';
import { supabase } from '../lib/supabase';

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
  description?: string;
  campaign_type: string;
  status: 'active' | 'scheduled' | 'completed' | 'paused';
  twilio_number_pool?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  // Additional fields for UI display
  targetCount?: number;
  completedCalls?: number;
  successRate?: number;
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
    const response = await api.post('retell/start-call', callData as unknown as Record<string, unknown>);
    return response;
  } catch (error: any) {
    console.error('Failed to start call:', error);
    throw new Error(error.response?.data?.error || 'Failed to start call');
  }
};

/**
 * Get call analytics and statistics
 */
export const getCallAnalytics = async (params: CallAnalyticsParams = {}) => {
  try {
    const response = await api.get('retell/get-call-analytics', params as unknown as Record<string, unknown>);
    return response;
  } catch (error: any) {
    console.error('Failed to fetch call analytics:', error);
    throw new Error('Failed to fetch call analytics');
  }
};

/**
 * Get list of voice campaigns
 */
export const getCampaigns = async (): Promise<Campaign[]> => {
  try {
    // Use the database/campaigns endpoint which routes through Netlify Functions in production
    const response = await api.get<{data: Campaign[]}>('database/campaigns', {
      status: 'active',
      sort_by: 'created_at',
      sort_order: 'desc'
    });
    
    return response.data.map(campaign => ({
      ...campaign,
      // Add UI-specific fields with default values if not present
      targetCount: campaign.targetCount || 0,
      completedCalls: campaign.completedCalls || 0,
      successRate: campaign.successRate || 0
    }));
  } catch (error: any) {
    console.error('Failed to fetch campaigns:', error);
    throw new Error('Failed to fetch campaigns');
  }
};

/**
 * Create a new voice campaign
 */
export const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'status' | 'completedCalls' | 'successRate'>) => {
  try {
    // Get current user ID from auth context if available
    let userId = null;
    try {
      const { data } = await supabase.auth.getSession();
      userId = data?.session?.user?.id;
    } catch (err) {
      console.error('Error getting user session:', err);
    }
    
    // Map UI campaign data to database schema
    const dbCampaignData = {
      name: campaignData.name,
      description: campaignData.description || '',
      campaign_type: campaignData.campaign_type,
      status: 'active',
      twilio_number_pool: campaignData.twilio_number_pool,
      created_by: userId
    };
    
    // Use the database/campaigns endpoint which routes through Netlify Functions in production
    const response = await api.post<Campaign>('database/campaigns', dbCampaignData);
    
    return {
      ...response,
      // Add UI-specific fields
      targetCount: 0,
      completedCalls: 0,
      successRate: 0
    };
  } catch (error: any) {
    console.error('Failed to create campaign:', error);
    throw new Error('Failed to create campaign');
  }
};

/**
 * Update campaign status
 */
export const updateCampaignStatus = async (campaignId: string, status: Campaign['status']) => {
  try {
    // Use the database/campaigns endpoint which routes through Netlify Functions in production
    const response = await api.put(`database/campaigns/${campaignId}`, { 
      status,
      updated_at: new Date().toISOString()
    });
    return response;
  } catch (error: any) {
    console.error('Failed to update campaign status:', error);
    throw new Error('Failed to update campaign status');
  }
};

/**
 * Delete a campaign
 */
export const deleteCampaign = async (campaignId: string) => {
  try {
    // Use the database/campaigns endpoint which routes through Netlify Functions in production
    await api.delete(`database/campaigns`, campaignId);
  } catch (error: any) {
    console.error('Failed to delete campaign:', error);
    throw new Error('Failed to delete campaign');
  }
};

/**
 * Get a specific campaign by ID
 */
export const getCampaignById = async (campaignId: string): Promise<Campaign | null> => {
  try {
    // Use the database/campaigns endpoint which routes through Netlify Functions in production
    const response = await api.get<Campaign>(`database/campaigns/${campaignId}`);
    return response;
  } catch (error: any) {
    console.error(`Failed to fetch campaign with ID ${campaignId}:`, error);
    return null;
  }
};

/**
 * Update campaign details
 */
export const updateCampaign = async (campaignId: string, campaignData: Partial<Campaign>) => {
  try {
    // Map UI campaign data to database schema
    const dbCampaignData = {
      ...campaignData,
      updated_at: new Date().toISOString()
    };
    
    // Use the database/campaigns endpoint which routes through Netlify Functions in production
    const response = await api.put(`database/campaigns/${campaignId}`, dbCampaignData);
    return response;
  } catch (error: any) {
    console.error('Failed to update campaign:', error);
    throw new Error('Failed to update campaign');
  }
};
