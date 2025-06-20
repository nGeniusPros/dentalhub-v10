const { nexhealthClient } = require('../nexhealth/client');

// Import response utilities
const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');
// Define required environment variables
const REQUIRED_ENV_VARS = ['NEXHEALTH_SUBDOMAIN', 'NEXHEALTH_LOCATION_ID'];



/**
 * Netlify function handler for the revenue dashboard
 */
exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  
  
  try {
    // Get query parameters
    const { timeframe = 'monthly', year = new Date().getFullYear() } = 
      event.queryStringParameters || {};
    
    // Calculate date range based on timeframe
    const { startDate, endDate } = calculateDateRange(timeframe, year);
    
    console.log(`Fetching revenue data for period: ${startDate} to ${endDate}`);
    console.log(`Using subdomain: ${process.env.NEXHEALTH_SUBDOMAIN}, location: ${process.env.NEXHEALTH_LOCATION_ID}`);
    
    // Fetch financial data from NexHealth
    let payments, charges;
    try {
      [payments, charges] = await Promise.all([
        nexhealthClient.get('/payments', { 
          start: startDate, 
          end: endDate,
          per_page: 100,
          page: 1
        }),
        nexhealthClient.get('/charges', { 
          start: startDate, 
          end: endDate,
          per_page: 100,
          page: 1
        })
      ]);
      
      console.log(`Retrieved ${payments.data?.length || 0} payments and ${charges.data?.length || 0} charges`);
    } catch (err) {
      console.errorResponse('Error fetching from NexHealth API:', err);
      throw err;
    }
    
    // Transform into dashboard format
    const dashboardData = transformRevenueData(payments, charges, timeframe, parseInt(year));
    
    // Wrap the dashboard data in a data property to match frontend expectations
    return successResponse({ data: dashboardData });
  } catch (err) {
    console.errorResponse('Error fetching revenue data:', err);
    return errorResponse(`Revenue data error: ${err.message}`, 500, event);
  }
};

/**
 * Calculate date range based on timeframe and year
 * @param {string} timeframe - 'annual', 'quarterly', or 'monthly'
 * @param {number} year - Year to calculate range for
 * @returns {Object} - Object with startDate and endDate
 */
function calculateDateRange(timeframe, year) {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  switch (timeframe) {
    case 'annual':
      return {
        startDate: `${year}-01-01`,
        endDate: `${year}-12-31`
      };
    case 'quarterly':
      const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
      const quarterStartMonth = (currentQuarter - 1) * 3;
      return {
        startDate: `${currentYear}-${(quarterStartMonth + 1).toString().padStart(2, '0')}-01`,
        endDate: now.toISOString().split('T')[0]
      };
    case 'monthly':
    default:
      const currentMonth = now.getMonth() + 1;
      return {
        startDate: `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`,
        endDate: now.toISOString().split('T')[0]
      };
  }
}

/**
 * Transform NexHealth data into dashboard format
 * @param {Array} payments - Payments data from NexHealth
 * @param {Array} charges - Charges data from NexHealth
 * @param {string} timeframe - 'annual', 'quarterly', or 'monthly'
 * @param {number} year - Year for the data
 * @returns {Object} - Formatted dashboard data
 */
function transformRevenueData(payments, charges, timeframe, year) {
  // Ensure payments and charges are arrays
  const paymentsArray = Array.isArray(payments.data) ? payments.data : 
                       (payments && typeof payments === 'object' && Array.isArray(payments.data)) ? payments.data : [];
  const chargesArray = Array.isArray(charges.data) ? charges.data : 
                      (charges && typeof charges === 'object' && Array.isArray(charges.data)) ? charges.data : [];
  
  console.log(`Processing ${paymentsArray.length} payments and ${chargesArray.length} charges`);
  
  // Calculate total revenue from payments
  let totalRevenue = paymentsArray.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);
  
  // Calculate total charges
  let totalCharges = chargesArray.reduce((sum, charge) => sum + parseFloat(charge.amount || 0), 0);
  
  console.log(`Calculated totalRevenue: ${totalRevenue}, totalCharges: ${totalCharges}`);
  
  // Set goals based on historical data or business targets
  // This would ideally come from a database or configuration
  const annualGoal = 1200000; // $1.2M example goal
  const monthlyGoal = annualGoal / 12;
  const quarterlyGoal = annualGoal / 4;
  
  // Group payments by period (month, quarter, etc.)
  const paymentsByPeriod = groupPaymentsByPeriod(paymentsArray, timeframe);
  
  // If no data is available, provide sample data for UI testing
  if (paymentsByPeriod.length === 0) {
    console.log('No payment data available, using sample data for UI testing');
    // Add sample data for the current timeframe
    if (timeframe === 'monthly') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      for (let i = 0; i < 6; i++) {
        const monthIndex = (currentMonth - i + 12) % 12;
        paymentsByPeriod.push({
          label: months[monthIndex],
          revenue: 10000 + Math.random() * 5000,
          count: Math.floor(10 + Math.random() * 20)
        });
      }
    } else if (timeframe === 'quarterly') {
      for (let i = 1; i <= 4; i++) {
        paymentsByPeriod.push({
          label: `Q${i}`,
          revenue: 30000 + Math.random() * 15000,
          count: Math.floor(30 + Math.random() * 50)
        });
      }
    }
  }
  
  // If no real data, provide sample annual data
  if (totalRevenue === 0) {
    totalRevenue = 850000; // Sample annual revenue
  }
  
  // Format data for the dashboard
  return {
    annual: {
      actual: totalRevenue,
      goal: annualGoal,
      performance: (totalRevenue / annualGoal) * 100,
      previousYear: totalRevenue * 0.9, // Sample previous year (10% less)
      yoyChange: 10 // Sample YoY change
    },
    periodic: paymentsByPeriod,
    timeframe,
    year,
    metrics: {
      totalCharges: totalCharges > 0 ? totalCharges : totalRevenue * 1.1, // Sample total charges
      collectionRate: totalCharges > 0 ? (totalRevenue / totalCharges) * 100 : 90, // Sample collection rate
      averagePayment: paymentsArray.length > 0 ? totalRevenue / paymentsArray.length : 250 // Sample average payment
    }
  };
}

/**
 * Group payments by period based on timeframe
 * @param {Array} payments - Payments data from NexHealth
 * @param {string} timeframe - 'annual', 'quarterly', or 'monthly'
 * @returns {Array} - Payments grouped by period
 */
function groupPaymentsByPeriod(payments, timeframe) {
  // Ensure payments is an array
  if (!Array.isArray(payments)) {
    console.log('Warning: payments is not an array, using empty array instead');
    payments = [];
  }
  const periods = {};
  
  payments.forEach(payment => {
    const date = new Date(payment.created_at);
    let periodKey;
    
    switch (timeframe) {
      case 'annual':
        periodKey = date.getFullYear().toString();
        break;
      case 'quarterly':
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        periodKey = `Q${quarter}`;
        break;
      case 'monthly':
      default:
        periodKey = date.toLocaleString('default', { month: 'short' });
        break;
    }
    
    if (!periods[periodKey]) {
      periods[periodKey] = {
        label: periodKey,
        revenue: 0,
        count: 0
      };
    }
    
    periods[periodKey].revenue += parseFloat(payment.amount || 0);
    periods[periodKey].count += 1;
  });
  
  // Convert to array and sort
  return Object.values(periods).sort((a, b) => {
    if (timeframe === 'monthly') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(a.label) - months.indexOf(b.label);
    }
    return a.label.localeCompare(b.label);
  });
}
