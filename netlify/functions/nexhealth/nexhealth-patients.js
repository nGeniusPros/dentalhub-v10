const { getAuthenticatedClient } = require('./auth');
const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');
// Define required environment variables
const REQUIRED_ENV_VARS = ['NEXHEALTH_SUBDOMAIN', 'NEXHEALTH_LOCATION_ID'];



/**
 * Transforms a raw patient object from NexHealth API to PatientListItem format.
 * @param {object} nexPatient - The raw patient object from NexHealth.
 * @returns {object} The patient data in PatientListItem format.
 */
function transformPatientToListItem(nexPatient) {
  if (!nexPatient) return null;
  
  // Extract basic info
  const patient = {
    id: nexPatient.id?.toString(),
    firstName: nexPatient.first_name || '',
    lastName: nexPatient.last_name || '',
    // Construct full name if not provided
    fullName: nexPatient.name || `${nexPatient.first_name || ''} ${nexPatient.last_name || ''}`.trim(),
    dateOfBirth: nexPatient.date_of_birth || nexPatient.dob || null,
    lastVisitDate: nexPatient.last_visit_date || null,
    contact: {
      email: nexPatient.email || null,
      phone: nexPatient.phone || nexPatient.cell_phone || nexPatient.home_phone || null,
    },
    // Include additional fields that might be useful for filtering/display
    status: nexPatient.status || 'active',
    // Add any other fields that might be useful for the UI
  };

  // Clean up any undefined values
  Object.keys(patient).forEach(key => {
    if (patient[key] === undefined) {
      delete patient[key];
    }
  });

  // Clean up contact object
  if (patient.contact) {
    Object.keys(patient.contact).forEach(key => {
      if (patient.contact[key] === undefined || patient.contact[key] === '') {
        delete patient.contact[key];
      }
    });
    
    // Remove contact object if it's empty
    if (Object.keys(patient.contact).length === 0) {
      delete patient.contact;
    }
  }

  return patient;
}

/**
 * Main handler for the /api/nexhealth/patients endpoint
 */
exports.handler = async (event, context) => {
  // Log the incoming request for debugging
  console.log('Incoming request:', {
    method: event.httpMethod,
    path: event.path,
    query: event.queryStringParameters || {},
    headers: event.headers
  });

  // Handle preflight OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return errorResponse({ 
      message: 'Method Not Allowed',
      allowedMethods: ['GET', 'OPTIONS']
    }, 405);
  }

  try {
    // Get authenticated client
    const client = await getAuthenticatedClient();
    const queryParams = event.queryStringParameters || {};

    // Build query parameters for NexHealth API
    const nexHealthParams = {
      page: queryParams.page || '1',
      per_page: queryParams.per_page || '25', // Default to 25 items per page
      subdomain: process.env.NEXHEALTH_SUBDOMAIN,
      location_id: process.env.NEXHEALTH_LOCATION_ID
    };

    // Add search term if provided
    if (queryParams.search) {
      nexHealthParams.search = queryParams.search;
    }
    
    // Add filter parameters if provided
    const supportedFilters = [
      'last_visit_before',
      'last_visit_after',
      'needs_recall',
      'procedure_code',
      'status',
      'provider_id',
      'location_id',
      'email',
      'phone',
      'status'
    ];
    
    // Copy supported filters from query params to API params
    supportedFilters.forEach(filter => {
      if (queryParams[filter] !== undefined && queryParams[filter] !== '') {
        // Convert filter names to match NexHealth API if needed
        const apiParamName = filter === 'procedure_code' ? 'procedure_code_history' : filter;
        nexHealthParams[apiParamName] = queryParams[filter];
      }
    });
    
    // Handle date range filters
    if (queryParams.last_visit_after) {
      nexHealthParams.last_visit_date_gte = queryParams.last_visit_after;
    }
    if (queryParams.last_visit_before) {
      nexHealthParams.last_visit_date_lte = queryParams.last_visit_before;
    }

    console.log('Making request to NexHealth API with params:', JSON.stringify(nexHealthParams, null, 2));
    
    // Make the API request
    const response = await client.get('/patients', { params: nexHealthParams });
    console.log('Received response from NexHealth API');
    
    // Handle error responses
    if (response.status >= 400 || !response.data) {
      const errorMessage = response.data?.message || response.data?.error || 
                         `NexHealth API error: ${response.status}`;
      console.errorResponse('NexHealth API error response:', response.data);
      return errorResponse({ 
        message: errorMessage,
        status: response.status
      }, response.status || 500);
    }

    // Transform the response data
    const patientsList = Array.isArray(response.data) 
      ? response.data.map(transformPatientToListItem).filter(p => p !== null)
      : [];
    
    // Extract pagination info
    const meta = response.meta || response.pagination || {};
    const totalItems = meta.total_count || meta.total_items || meta.total || patientsList.length;
    const perPage = parseInt(nexHealthParams.per_page, 10);
    const currentPage = parseInt(nexHealthParams.page, 10);
    let totalPages = meta.total_pages || Math.ceil(totalItems / perPage) || 1;
    
    // Ensure currentPage does not exceed totalPages
    if (currentPage > totalPages) {
      totalPages = currentPage; // In case totalPages is 0 but we have a page number
    }

    const pagination = {
      totalItems,
      totalPages,
      currentPage,
      perPage,
    };

    return successResponse({
      data: patientsList,
      pagination,
      meta: {
        ...meta,
        // Include any additional metadata from the API
      }
    });

  } catch (error) {
    if (error.response) {
      console.errorResponse('Error response from NexHealth API:', error.response.data);
    } else {
      console.errorResponse('Error in patients endpoint:', error);
    }
    const errorMessage = error.response?.data?.message || error.message || 'Internal Server Error';
    const statusCode = error.response?.status || 500;
    return errorResponse({ message: errorMessage }, statusCode);
  }
};
