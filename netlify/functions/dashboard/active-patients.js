/**
 * Active Patients Dashboard Function
 * 
 * Fetches and processes patient data from NexHealth API to provide
 * metrics for the active patients dashboard.
 */
const { nexhealthClient } = require('../nexhealth/client');
const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');

// Helper to get date range based on period
const getDateRange = (period) => {
  const now = new Date();
  const end = now.toISOString().split('T')[0]; // Today in YYYY-MM-DD
  let start;
  
  switch (period) {
    case 'week':
      // 7 days ago
      start = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
      break;
    case 'month':
      // 30 days ago
      start = new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0];
      break;
    case 'quarter':
      // 90 days ago
      start = new Date(now.setDate(now.getDate() - 90)).toISOString().split('T')[0];
      break;
    case 'year':
      // 365 days ago
      start = new Date(now.setDate(now.getDate() - 365)).toISOString().split('T')[0];
      break;
    default:
      // Default to 30 days
      start = new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0];
  }
  
  return { start, end };
};

// Helper to categorize patients by age
const categorizeByAge = (patients) => {
  const ageGroups = {
    'Under 18': 0,
    '18-30': 0,
    '31-45': 0,
    '46-60': 0,
    '61+': 0
  };
  
  patients.forEach(patient => {
    if (!patient.birth_date) return;
    
    const birthDate = new Date(patient.birth_date);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    
    if (age < 18) ageGroups['Under 18']++;
    else if (age <= 30) ageGroups['18-30']++;
    else if (age <= 45) ageGroups['31-45']++;
    else if (age <= 60) ageGroups['46-60']++;
    else ageGroups['61+']++;
  });
  
  return Object.entries(ageGroups).map(([ageGroup, count]) => ({ ageGroup, count }));
};

// Helper to categorize patients by provider
const categorizeByProvider = async (patients, appointments) => {
  // Get all providers
  const providersResponse = await nexhealthClient.get('/providers');
  const providers = providersResponse.data;
  
  // Create a map of provider IDs to names
  const providerMap = providers.reduce((map, provider) => {
    map[provider.id] = `${provider.first_name} ${provider.last_name}`;
    return map;
  }, {});
  
  // Count patients by provider based on their appointments
  const providerCounts = {};
  
  appointments.forEach(appointment => {
    const providerId = appointment.provider_id;
    const patientId = appointment.patient_id;
    
    if (providerId && patientId) {
      const providerName = providerMap[providerId] || `Provider ${providerId}`;
      
      if (!providerCounts[providerName]) {
        providerCounts[providerName] = new Set();
      }
      
      providerCounts[providerName].add(patientId);
    }
  });
  
  // Convert to array format
  return Object.entries(providerCounts).map(([provider, patientSet]) => ({
    provider,
    count: patientSet.size
  })).sort((a, b) => b.count - a.count);
};

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  
  
  try {
    // Get period from query parameters (default to month)
    const period = event.queryStringParameters?.period || 'month';
    const { start, end } = getDateRange(period);
    
    // Fetch patients data
    const patientsResponse = await nexhealthClient.get('/patients', {
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
    
    const patients = patientsResponse.data;
    const appointments = appointmentsResponse.data;
    
    // Identify new vs returning patients
    // For this example, we'll consider patients created in the period as new
    // and patients with appointments but created before the period as returning
    const patientCreationDates = {};
    patients.forEach(patient => {
      patientCreationDates[patient.id] = patient.created_at;
    });
    
    const patientIds = new Set(patients.map(p => p.id));
    const returningPatientIds = new Set();
    
    appointments.forEach(appointment => {
      const patientId = appointment.patient_id;
      if (patientId && !patientIds.has(patientId)) {
        returningPatientIds.add(patientId);
      }
    });
    
    // Calculate metrics
    const newPatients = patients.length;
    const returningPatients = returningPatientIds.size;
    const totalActivePatients = newPatients + returningPatients;
    
    // Categorize patients by age
    const byAge = categorizeByAge(patients);
    
    // Categorize patients by provider
    const byProvider = await categorizeByProvider(patients, appointments);
    
    // Return formatted data
    return successResponse({
      data: {
        total: totalActivePatients,
        newPatients,
        returningPatients,
        byAge,
        byProvider: byProvider.slice(0, 10) // Top 10 providers
      }
    });
  } catch (err) {
    console.errorResponse('Error fetching active patients data:', err);
    return errorResponse(`Failed to fetch active patients data: ${err.message}`, 500, event);
  }
};
