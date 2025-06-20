/**
 * Patient Satisfaction Dashboard Function
 * 
 * Fetches and processes patient feedback data from NexHealth API to provide
 * metrics for the patient satisfaction dashboard.
 */
const { nexhealthClient } = require('../nexhealth/client');
const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');

// Helper to get date range based on period
const getDateRange = (period = 'month') => {
  const now = new Date();
  const end = now.toISOString().split('T')[0];
  let start;
  
  switch (period) {
    case 'quarter':
      // 90 days ago
      start = new Date(now.setDate(now.getDate() - 90)).toISOString().split('T')[0];
      break;
    case 'year':
      // 365 days ago
      start = new Date(now.setDate(now.getDate() - 365)).toISOString().split('T')[0];
      break;
    case 'month':
    default:
      // 30 days ago
      start = new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0];
  }
  
  return { start, end };
};

// Helper to extract satisfaction data from patient documents
// Note: This is a simplified implementation as NexHealth may not have direct
// satisfaction survey data. In a real implementation, you might need to
// integrate with a separate survey system or use a different approach.
const extractSatisfactionData = (patientDocuments, appointments) => {
  // For this example, we'll simulate satisfaction data by:
  // 1. Looking for documents that might contain satisfaction info
  // 2. Generating sample satisfaction scores based on appointment data
  
  // Map of patient IDs to their most recent appointment status
  const patientAppointmentStatus = {};
  appointments.forEach(appointment => {
    const patientId = appointment.patient_id;
    if (patientId) {
      patientAppointmentStatus[patientId] = appointment.status || 'unknown';
    }
  });
  
  // Extract satisfaction data from documents (simulated)
  const satisfactionData = [];
  
  patientDocuments.forEach(document => {
    // Check if document might be a satisfaction survey
    const isSurvey = document.name?.toLowerCase().includes('survey') || 
                     document.name?.toLowerCase().includes('feedback') ||
                     document.document_type_id === 'satisfaction_survey'; // Hypothetical type
    
    if (isSurvey) {
      // In a real implementation, you would parse the document content
      // For this example, we'll generate a simulated score
      const patientId = document.patient_id;
      const appointmentStatus = patientAppointmentStatus[patientId] || 'unknown';
      
      // Generate a score based on appointment status (simulated)
      let score = 0;
      switch (appointmentStatus) {
        case 'completed':
          score = Math.floor(Math.random() * 2) + 4; // 4-5
          break;
        case 'cancelled':
          score = Math.floor(Math.random() * 2) + 2; // 2-3
          break;
        case 'no_show':
          score = Math.floor(Math.random() * 2) + 1; // 1-2
          break;
        default:
          score = Math.floor(Math.random() * 5) + 1; // 1-5
      }
      
      satisfactionData.push({
        patientId,
        documentId: document.id,
        date: document.created_at || document.updated_at,
        score,
        category: document.name?.split(' ')[0] || 'General',
        feedback: '' // In a real implementation, this would contain actual feedback
      });
    }
  });
  
  return satisfactionData;
};

// Helper to calculate NPS (Net Promoter Score)
const calculateNPS = (satisfactionData) => {
  if (satisfactionData.length === 0) return 0;
  
  // Count promoters (9-10), passives (7-8), and detractors (0-6)
  // Note: We're using a 5-point scale in our simulation, so we'll adjust:
  // 5 = promoter, 4 = passive, 1-3 = detractor
  const promoters = satisfactionData.filter(data => data.score === 5).length;
  const passives = satisfactionData.filter(data => data.score === 4).length;
  const detractors = satisfactionData.filter(data => data.score <= 3).length;
  
  // Calculate percentages
  const total = satisfactionData.length;
  const promoterPercentage = (promoters / total) * 100;
  const detractorPercentage = (detractors / total) * 100;
  
  // NPS = % Promoters - % Detractors
  return Math.round(promoterPercentage - detractorPercentage);
};

// Helper to categorize satisfaction by provider
const categorizeSatisfactionByProvider = async (satisfactionData, appointments) => {
  // Get all providers
  const providersResponse = await nexhealthClient.get('/providers');
  const providers = providersResponse.data;
  
  // Create a map of provider IDs to names
  const providerMap = providers.reduce((map, provider) => {
    map[provider.id] = `${provider.first_name} ${provider.last_name}`;
    return map;
  }, {});
  
  // Create a map of patient IDs to their provider IDs from appointments
  const patientProviderMap = {};
  appointments.forEach(appointment => {
    if (appointment.patient_id && appointment.provider_id) {
      patientProviderMap[appointment.patient_id] = appointment.provider_id;
    }
  });
  
  // Group satisfaction data by provider
  const providerSatisfaction = {};
  
  satisfactionData.forEach(data => {
    const providerId = patientProviderMap[data.patientId];
    if (providerId) {
      const providerName = providerMap[providerId] || `Provider ${providerId}`;
      
      if (!providerSatisfaction[providerName]) {
        providerSatisfaction[providerName] = {
          scores: [],
          count: 0,
          total: 0
        };
      }
      
      providerSatisfaction[providerName].scores.push(data.score);
      providerSatisfaction[providerName].count++;
      providerSatisfaction[providerName].total += data.score;
    }
  });
  
  // Calculate average scores and format the result
  return Object.entries(providerSatisfaction).map(([provider, data]) => ({
    provider,
    averageScore: data.count > 0 ? data.total / data.count : 0,
    responseCount: data.count
  })).sort((a, b) => b.averageScore - a.averageScore);
};

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  
  
  try {
    // Get period from query parameters (default to month)
    const period = event.queryStringParameters?.period || 'month';
    const { start, end } = getDateRange(period);
    
    // Fetch patient documents data
    const documentsResponse = await nexhealthClient.get('/patient_documents', {
      per_page: 100,
      created_after: start,
      created_before: end
    });
    
    // Fetch appointments data for the same period
    const appointmentsResponse = await nexhealthClient.get('/appointments', {
      per_page: 100,
      start_date: start,
      end_date: end
    });
    
    const patientDocuments = documentsResponse.data;
    const appointments = appointmentsResponse.data;
    
    // Extract satisfaction data
    const satisfactionData = extractSatisfactionData(patientDocuments, appointments);
    
    // Calculate overall metrics
    const totalResponses = satisfactionData.length;
    const averageScore = totalResponses > 0 ? 
      satisfactionData.reduce((sum, data) => sum + data.score, 0) / totalResponses : 0;
    const npsScore = calculateNPS(satisfactionData);
    
    // Categorize satisfaction by score
    const scoreDistribution = [1, 2, 3, 4, 5].map(score => ({
      score,
      count: satisfactionData.filter(data => data.score === score).length,
      percentage: totalResponses > 0 ? 
        (satisfactionData.filter(data => data.score === score).length / totalResponses) * 100 : 0
    }));
    
    // Categorize satisfaction by provider
    const byProvider = await categorizeSatisfactionByProvider(satisfactionData, appointments);
    
    // Return formatted data
    return successResponse({
      data: {
        period: {
          start,
          end,
          label: period
        },
        overall: {
          totalResponses,
          averageScore,
          npsScore
        },
        scoreDistribution,
        byProvider: byProvider.slice(0, 10), // Top 10 providers
        // In a real implementation, you might include actual feedback comments here
        recentFeedback: []
      }
    });
  } catch (err) {
    console.errorResponse('Error fetching patient satisfaction data:', err);
    return errorResponse(`Failed to fetch patient satisfaction data: ${err.message}`, 500, event);
  }
};
