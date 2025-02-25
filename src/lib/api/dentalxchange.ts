import axios from 'axios';

const DENTALXCHANGE_API_BASE = process.env.VITE_DENTALXCHANGE_API_URL;
const API_KEY = process.env.VITE_DENTALXCHANGE_API_KEY;

const dentalXchangeApi = axios.create({
  baseURL: DENTALXCHANGE_API_BASE,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export const fetchEligibility = async (patientId: string) => {
  try {
    const response = await dentalXchangeApi.get(`/eligibility/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching eligibility:', error);
    throw error;
  }
};

export const fetchClaims = async (params: { 
  startDate?: string;
  endDate?: string;
  status?: string;
}) => {
  try {
    const response = await dentalXchangeApi.get('/claims', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching claims:', error);
    throw error;
  }
};

export const submitClaim = async (claimData: any) => {
  try {
    const response = await dentalXchangeApi.post('/claims', claimData);
    return response.data;
  } catch (error) {
    console.error('Error submitting claim:', error);
    throw error;
  }
};

export const checkClaimStatus = async (claimId: string) => {
  try {
    const response = await dentalXchangeApi.get(`/claims/${claimId}/status`);
    return response.data;
  } catch (error) {
    console.error('Error checking claim status:', error);
    throw error;
  }
};