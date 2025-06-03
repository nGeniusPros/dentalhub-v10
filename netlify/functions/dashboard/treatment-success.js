/**
 * Treatment Success Dashboard Function
 * 
 * Fetches and processes treatment data from NexHealth API to provide
 * metrics for the treatment success dashboard.
 */
const { nexhealthClient } = require('../nexhealth/client');
const { success, error, handleOptions } = require('../utils/response');

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

// Helper to categorize procedures by type
const categorizeProceduresByType = (procedures) => {
  const typeMap = {};
  
  procedures.forEach(procedure => {
    const type = procedure.name || 'Uncategorized';
    
    if (!typeMap[type]) {
      typeMap[type] = {
        count: 0,
        completed: 0,
        revenue: 0
      };
    }
    
    typeMap[type].count++;
    
    // Determine if procedure was completed based on status
    // This is a simplified example - actual completion logic may vary
    if (procedure.status === 'completed') {
      typeMap[type].completed++;
      typeMap[type].revenue += procedure.fee || 0;
    }
  });
  
  return Object.entries(typeMap).map(([type, data]) => ({
    type,
    count: data.count,
    completed: data.completed,
    completionRate: data.count > 0 ? (data.completed / data.count) * 100 : 0,
    revenue: data.revenue
  })).sort((a, b) => b.count - a.count);
};

// Helper to analyze treatment plans
const analyzeTreatmentPlans = (appointments, procedures) => {
  // Map procedures to appointments
  const appointmentProcedures = {};
  
  procedures.forEach(procedure => {
    const appointmentId = procedure.appointment_id;
    if (appointmentId) {
      if (!appointmentProcedures[appointmentId]) {
        appointmentProcedures[appointmentId] = [];
      }
      appointmentProcedures[appointmentId].push(procedure);
    }
  });
  
  // Analyze treatment plans (appointments with multiple procedures)
  const treatmentPlans = [];
  
  appointments.forEach(appointment => {
    const appointmentProcs = appointmentProcedures[appointment.id] || [];
    
    if (appointmentProcs.length >= 2) {
      // This appointment has multiple procedures - consider it a treatment plan
      const totalProcedures = appointmentProcs.length;
      const completedProcedures = appointmentProcs.filter(p => p.status === 'completed').length;
      const completionRate = totalProcedures > 0 ? (completedProcedures / totalProcedures) * 100 : 0;
      
      treatmentPlans.push({
        id: appointment.id,
        patientId: appointment.patient_id,
        date: appointment.start_time,
        totalProcedures,
        completedProcedures,
        completionRate,
        status: completionRate === 100 ? 'completed' : 
                completionRate > 0 ? 'in-progress' : 'not-started'
      });
    }
  });
  
  return treatmentPlans;
};

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions(event);
  }
  
  try {
    // Get period from query parameters (default to month)
    const period = event.queryStringParameters?.period || 'month';
    const { start, end } = getDateRange(period);
    
    // Fetch appointments data
    const appointmentsResponse = await nexhealthClient.get('/appointments', {
      per_page: 100,
      start_date: start,
      end_date: end
    });
    
    // Fetch procedures data
    const proceduresResponse = await nexhealthClient.get('/procedures', {
      per_page: 100
    });
    
    const appointments = appointmentsResponse.data;
    const procedures = proceduresResponse.data;
    
    // Filter procedures to match our date range
    // (assuming procedures have a created_at field)
    const filteredProcedures = procedures.filter(procedure => {
      const createdAt = procedure.created_at || procedure.updated_at;
      return createdAt && createdAt >= start && createdAt <= end;
    });
    
    // Categorize procedures by type
    const proceduresByType = categorizeProceduresByType(filteredProcedures);
    
    // Analyze treatment plans
    const treatmentPlans = analyzeTreatmentPlans(appointments, filteredProcedures);
    
    // Calculate overall metrics
    const totalProcedures = filteredProcedures.length;
    const completedProcedures = filteredProcedures.filter(p => p.status === 'completed').length;
    const completionRate = totalProcedures > 0 ? (completedProcedures / totalProcedures) * 100 : 0;
    
    const totalTreatmentPlans = treatmentPlans.length;
    const completedTreatmentPlans = treatmentPlans.filter(tp => tp.status === 'completed').length;
    const treatmentPlanCompletionRate = totalTreatmentPlans > 0 ? 
      (completedTreatmentPlans / totalTreatmentPlans) * 100 : 0;
    
    // Return formatted data
    return success({
      data: {
        period: {
          start,
          end,
          label: period
        },
        overall: {
          totalProcedures,
          completedProcedures,
          completionRate,
          totalTreatmentPlans,
          completedTreatmentPlans,
          treatmentPlanCompletionRate
        },
        proceduresByType: proceduresByType.slice(0, 10), // Top 10 procedure types
        treatmentPlans: treatmentPlans.slice(0, 20), // Top 20 treatment plans
        averageTreatmentLength: treatmentPlans.length > 0 ? 
          treatmentPlans.reduce((sum, tp) => sum + tp.totalProcedures, 0) / treatmentPlans.length : 0
      }
    });
  } catch (err) {
    console.error('Error fetching treatment success data:', err);
    return error(`Failed to fetch treatment success data: ${err.message}`, 500, event);
  }
};
