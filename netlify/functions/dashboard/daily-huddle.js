/**
 * Daily Huddle Dashboard Function
 * 
 * Fetches and processes data from NexHealth API to provide
 * a summary of the day's appointments, procedures, and other
 * important metrics for the daily huddle meeting.
 */
const { nexhealthClient } = require('../nexhealth/client');
const { success, error, handleOptions } = require('../utils/response');

// Helper to get date range for today or a specific date
const getDateRange = (dateString) => {
  let date;
  
  if (dateString) {
    // Use the provided date
    date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Invalid date, use today
      date = new Date();
    }
  } else {
    // Use today
    date = new Date();
  }
  
  // Format as YYYY-MM-DD
  const start = date.toISOString().split('T')[0];
  const end = start; // Same day for daily huddle
  
  return { start, end, date };
};

// Helper to categorize appointments by status
const categorizeAppointmentsByStatus = (appointments) => {
  const statusCounts = {
    confirmed: 0,
    unconfirmed: 0,
    checked_in: 0,
    completed: 0,
    cancelled: 0,
    no_show: 0,
    other: 0
  };
  
  appointments.forEach(appointment => {
    const status = appointment.status?.toLowerCase() || 'other';
    if (statusCounts[status] !== undefined) {
      statusCounts[status]++;
    } else {
      statusCounts.other++;
    }
  });
  
  return Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
};

// Helper to categorize appointments by provider
const categorizeAppointmentsByProvider = async (appointments) => {
  // Get all providers
  const providersResponse = await nexhealthClient.get('/providers');
  const providers = providersResponse.data;
  
  // Create a map of provider IDs to names
  const providerMap = providers.reduce((map, provider) => {
    map[provider.id] = `${provider.first_name} ${provider.last_name}`;
    return map;
  }, {});
  
  // Count appointments by provider
  const providerCounts = {};
  
  appointments.forEach(appointment => {
    const providerId = appointment.provider_id;
    if (providerId) {
      const providerName = providerMap[providerId] || `Provider ${providerId}`;
      
      if (!providerCounts[providerName]) {
        providerCounts[providerName] = {
          total: 0,
          confirmed: 0,
          unconfirmed: 0
        };
      }
      
      providerCounts[providerName].total++;
      
      // Track confirmed/unconfirmed status
      const status = appointment.status?.toLowerCase();
      if (status === 'confirmed' || status === 'checked_in' || status === 'completed') {
        providerCounts[providerName].confirmed++;
      } else {
        providerCounts[providerName].unconfirmed++;
      }
    }
  });
  
  // Convert to array format
  return Object.entries(providerCounts).map(([provider, counts]) => ({
    provider,
    total: counts.total,
    confirmed: counts.confirmed,
    unconfirmed: counts.unconfirmed,
    confirmationRate: counts.total > 0 ? (counts.confirmed / counts.total) * 100 : 0
  })).sort((a, b) => b.total - a.total);
};

// Helper to organize appointments by time
const organizeAppointmentsByTime = (appointments) => {
  // Sort appointments by start time
  const sortedAppointments = [...appointments].sort((a, b) => {
    return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
  });
  
  // Group by hour
  const hourlyGroups = {};
  
  sortedAppointments.forEach(appointment => {
    const startTime = new Date(appointment.start_time);
    const hour = startTime.getHours();
    const hourKey = `${hour}:00`;
    
    if (!hourlyGroups[hourKey]) {
      hourlyGroups[hourKey] = [];
    }
    
    hourlyGroups[hourKey].push({
      id: appointment.id,
      patientId: appointment.patient_id,
      patientName: appointment.patient_name || 'Unknown Patient',
      startTime: appointment.start_time,
      endTime: appointment.end_time,
      status: appointment.status || 'unknown',
      providerId: appointment.provider_id,
      appointmentType: appointment.appointment_type || 'General',
      operatory: appointment.operatory || 'Not Specified'
    });
  });
  
  // Convert to array format
  return Object.entries(hourlyGroups).map(([hour, appointments]) => ({
    hour,
    appointments
  })).sort((a, b) => {
    // Sort by hour
    const hourA = parseInt(a.hour.split(':')[0]);
    const hourB = parseInt(b.hour.split(':')[0]);
    return hourA - hourB;
  });
};

// Helper to summarize procedures for the day
const summarizeProcedures = (procedures, appointments) => {
  // Create a map of appointment IDs for quick lookup
  const appointmentIds = new Set(appointments.map(a => a.id));
  
  // Filter procedures for today's appointments
  const todaysProcedures = procedures.filter(procedure => {
    return procedure.appointment_id && appointmentIds.has(procedure.appointment_id);
  });
  
  // Group procedures by type
  const proceduresByType = {};
  
  todaysProcedures.forEach(procedure => {
    const type = procedure.name || 'Uncategorized';
    
    if (!proceduresByType[type]) {
      proceduresByType[type] = {
        count: 0,
        totalFee: 0
      };
    }
    
    proceduresByType[type].count++;
    proceduresByType[type].totalFee += procedure.fee || 0;
  });
  
  // Convert to array format
  return Object.entries(proceduresByType).map(([type, data]) => ({
    type,
    count: data.count,
    totalFee: data.totalFee
  })).sort((a, b) => b.count - a.count);
};

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions(event);
  }
  
  try {
    // Get date from query parameters (default to today)
    const dateParam = event.queryStringParameters?.date;
    const { start, end, date } = getDateRange(dateParam);
    
    // Format date for display
    const displayDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Fetch appointments for the day
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
    
    // Calculate metrics
    const totalAppointments = appointments.length;
    const confirmedAppointments = appointments.filter(a => 
      a.status === 'confirmed' || a.status === 'checked_in' || a.status === 'completed'
    ).length;
    
    const confirmationRate = totalAppointments > 0 ? 
      (confirmedAppointments / totalAppointments) * 100 : 0;
    
    // Categorize appointments by status
    const byStatus = categorizeAppointmentsByStatus(appointments);
    
    // Categorize appointments by provider
    const byProvider = await categorizeAppointmentsByProvider(appointments);
    
    // Organize appointments by time
    const byTime = organizeAppointmentsByTime(appointments);
    
    // Summarize procedures
    const proceduresSummary = summarizeProcedures(procedures, appointments);
    
    // Calculate expected revenue for the day
    const expectedRevenue = proceduresSummary.reduce((sum, p) => sum + p.totalFee, 0);
    
    // Return formatted data
    return success({
      data: {
        date: {
          iso: start,
          display: displayDate
        },
        summary: {
          totalAppointments,
          confirmedAppointments,
          confirmationRate,
          expectedRevenue
        },
        appointments: {
          byStatus,
          byProvider,
          byTime
        },
        procedures: {
          total: proceduresSummary.reduce((sum, p) => sum + p.count, 0),
          byType: proceduresSummary
        }
      }
    });
  } catch (err) {
    console.error('Error fetching daily huddle data:', err);
    return error(`Failed to fetch daily huddle data: ${err.message}`, 500, event);
  }
};
