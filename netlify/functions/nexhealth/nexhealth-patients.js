const { getAuthenticatedClient } = require('./auth');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Transforms a raw patient object from NexHealth API to PatientListItem format.
 * @param {object} nexPatient - The raw patient object from NexHealth.
 * @returns {object} The patient data in PatientListItem format.
 */
function transformPatientToListItem(nexPatient) {
  if (!nexPatient) return null;
  return {
    id: nexPatient.id?.toString(),
    firstName: nexPatient.first_name,
    lastName: nexPatient.last_name,
    fullName: nexPatient.name, // NexHealth often provides a 'name' field (e.g., first_name + last_name)
    dateOfBirth: nexPatient.bio?.date_of_birth,
    // lastVisitDate: nexPatient.last_visit_date, // Placeholder: Actual field name from API needed
    contact: {
      email: nexPatient.email,
      phone: nexPatient.bio?.phone_number || nexPatient.bio?.cell_phone_number || nexPatient.bio?.home_phone_number,
    },
    // isInactive: nexPatient.inactive, // Optional: if available and useful for list views
  };
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return errorResponse({ message: 'Method Not Allowed' }, 405);
  }

  try {
    const client = await getAuthenticatedClient();
    const queryParams = event.queryStringParameters || {};

    const nexHealthParams = {
      page: queryParams.page || '1',
      per_page: queryParams.per_page || '25', // Default items per page
    };

    if (queryParams.search) {
      // Assuming NexHealth API uses a 'search' parameter for general text search.
      // This might need adjustment based on actual API capabilities (e.g., 'q', 'filter[name]').
      nexHealthParams.search = queryParams.search;
    }

    // TODO: Add mapping for other specific filters from queryParams to nexHealthParams
    // e.g., if (queryParams.last_visit_from) nexHealthParams.last_visit_date_gte = queryParams.last_visit_from;

    const { data: nexHealthResponseData, status } = await client.get('/patients', {
      params: nexHealthParams,
    });

    if (status >= 400 || !nexHealthResponseData) {
      const errorMessage = nexHealthResponseData?.message || nexHealthResponseData?.error || `NexHealth API error: ${status}`;
      console.error('NexHealth API error response:', nexHealthResponseData);
      return errorResponse({ message: errorMessage }, status || 500);
    }

    const patientsList = (nexHealthResponseData.data || []).map(transformPatientToListItem).filter(p => p !== null);
    
    // Assuming pagination details are in a 'meta' object or similar in the NexHealth response.
    // Adjust these paths based on the actual NexHealth API response structure.
    const meta = nexHealthResponseData.meta || nexHealthResponseData.pagination || {};
    
    let totalItems = meta.total_count || meta.total_items || meta.total || 0;
    let perPage = meta.per_page || parseInt(nexHealthParams.per_page, 10);
    let currentPage = meta.current_page || parseInt(nexHealthParams.page, 10);
    let totalPages = meta.total_pages || 0;

    if (totalItems > 0 && perPage > 0 && totalPages === 0) {
        totalPages = Math.ceil(totalItems / perPage);
    }
    // Ensure currentPage does not exceed totalPages if totalPages is known
    if (totalPages > 0 && currentPage > totalPages) {
        currentPage = totalPages;
    }

    const pagination = {
      totalItems: totalItems,
      totalPages: totalPages,
      currentPage: currentPage,
      perPage: perPage,
    };

    return successResponse({
      patients: patientsList,
      pagination: pagination,
    });

  } catch (error) {
    console.error('Error fetching patients list from NexHealth:', error.message);
    if (error.response) {
      console.error('NexHealth client error response data:', error.response.data);
      console.error('NexHealth client error response status:', error.response.status);
    }
    const errorMessage = error.response?.data?.message || error.message || 'Internal Server Error';
    const statusCode = error.response?.status || 500;
    return errorResponse({ message: errorMessage }, statusCode);
  }
};
