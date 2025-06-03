const { nexhealthClient } = require('../nexhealth/client');
const { success, error, handleOptions } = require('../utils/response');

/**
 * Netlify function handler for the monthly report dashboard
 */
exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions(event);
  }
  
  try {
    // Get query parameters
    const { year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = 
      event.queryStringParameters || {};
    
    // Calculate date range for the month
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;
    
    // Fetch data from NexHealth
    const [payments, appointments, procedures] = await Promise.all([
      nexhealthClient.get('/payments', { 
        start: startDate, 
        end: endDate, 
        per_page: 100 
      }),
      nexhealthClient.get('/appointments', { 
        start: startDate, 
        end: endDate, 
        per_page: 100,
        include: ['procedures']
      }),
      nexhealthClient.get('/procedures', { 
        start: startDate, 
        end: endDate, 
        per_page: 100 
      })
    ]);
    
    // Transform into monthly report format
    const reportData = transformMonthlyReportData(
      payments.data, 
      appointments.data, 
      procedures.data,
      year,
      month,
      startDate,
      endDate
    );
    
    return success(reportData);
  } catch (err) {
    console.error('Error fetching monthly report data:', err);
    return error(`Monthly report error: ${err.message}`, 500, event);
  }
};

/**
 * Transform NexHealth data into monthly report format
 * @param {Array} payments - Payments data from NexHealth
 * @param {Array} appointments - Appointments data from NexHealth
 * @param {Array} procedures - Procedures data from NexHealth
 * @param {number} year - Year for the report
 * @param {number} month - Month for the report
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {Object} - Formatted monthly report data
 */
function transformMonthlyReportData(payments, appointments, procedures, year, month, startDate, endDate) {
  // Calculate revenue metrics
  const totalRevenue = payments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);
  
  // Calculate appointment metrics
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(appt => appt.status === 'completed').length;
  const noShowRate = totalAppointments > 0 
    ? (appointments.filter(appt => appt.status === 'no_show').length / totalAppointments) * 100 
    : 0;
  
  // Calculate procedure metrics
  const proceduresByType = {};
  procedures.forEach(proc => {
    const type = proc.code || 'unknown';
    if (!proceduresByType[type]) {
      proceduresByType[type] = {
        count: 0,
        revenue: 0,
        name: proc.description || type
      };
    }
    proceduresByType[type].count += 1;
    proceduresByType[type].revenue += parseFloat(proc.fee || 0);
  });
  
  // Format the month name
  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
  
  return {
    title: `${monthName} ${year} Monthly Report`,
    period: {
      month: parseInt(month),
      year: parseInt(year),
      startDate,
      endDate
    },
    revenue: {
      total: totalRevenue,
      average: totalAppointments > 0 ? totalRevenue / totalAppointments : 0,
      byDay: groupPaymentsByDay(payments)
    },
    appointments: {
      total: totalAppointments,
      completed: completedAppointments,
      completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0,
      noShowRate
    },
    procedures: {
      total: procedures.length,
      byType: Object.values(proceduresByType).sort((a, b) => b.count - a.count)
    }
  };
}

/**
 * Group payments by day of the month
 * @param {Array} payments - Payments data from NexHealth
 * @returns {Array} - Daily revenue data
 */
function groupPaymentsByDay(payments) {
  const dailyRevenue = {};
  
  payments.forEach(payment => {
    const date = new Date(payment.created_at);
    const day = date.getDate();
    
    if (!dailyRevenue[day]) {
      dailyRevenue[day] = 0;
    }
    
    dailyRevenue[day] += parseFloat(payment.amount || 0);
  });
  
  // Convert to array format for charting
  return Object.entries(dailyRevenue).map(([day, amount]) => ({
    day: parseInt(day),
    amount
  })).sort((a, b) => a.day - b.day);
}
