const { nexhealthClient } = require('./client');
const { success, error, handleOptions } = require('../utils/response');

/**
 * Transforms raw NexHealth patient data into the PatientDetailsData format.
 * @param {Object} nexPatient - The patient object from NexHealth API.
 * @returns {Object|null} The transformed patient data or null if input is invalid.
 */
function transformPatientData(nexPatient) {
  if (!nexPatient || typeof nexPatient !== 'object') {
    console.error('Invalid nexPatient object received for transformation:', nexPatient);
    return null;
  }

  // Based on the PatientDetailsData interface and the NexHealth patient response example
  return {
    id: nexPatient.id,
    firstName: nexPatient.first_name,
    lastName: nexPatient.last_name,
    fullName: nexPatient.name, // NexHealth provides 'name' as first + last
    email: nexPatient.email,
    dateOfBirth: nexPatient.bio?.date_of_birth, // YYYY-MM-DD
    phoneNumber: nexPatient.bio?.phone_number || nexPatient.bio?.cell_phone_number || nexPatient.bio?.home_phone_number,
    address: {
      streetAddress: nexPatient.bio?.address_line_1 || nexPatient.bio?.street_address,
      city: nexPatient.bio?.city,
      state: nexPatient.bio?.state,
      zipCode: nexPatient.bio?.zip_code,
    },
    gender: nexPatient.bio?.gender,
    isNewPatient: nexPatient.bio?.new_patient,
    isInactive: nexPatient.inactive,
  };
}

exports.handler = async (event, context) => {
  // Handle CORS preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions(event);
  }

  if (event.httpMethod !== 'GET') {
    return error('Method Not Allowed', 405, event);
  }

  const pathParts = event.path.split('/');
  const patientId = pathParts[pathParts.length - 1];

  if (!patientId || isNaN(parseInt(patientId, 10))) {
    return error('Valid Patient ID is required in the path.', 400, event);
  }

  try {
    const response = await nexhealthClient.get(`/patients/${patientId}`);
    
    let rawPatientData;

    // Attempt to extract patient data based on potential NexHealth API response structures for GET /patients/{id}
    // The user-provided doc was for GET /patients (plural) which had data.patients or data[0].patients
    if (response && response.data && typeof response.data === 'object') {
        if (response.data.id) { // Direct patient object
            rawPatientData = response.data;
        } else if (response.data.patient && typeof response.data.patient === 'object') { // Nested under 'patient'
            rawPatientData = response.data.patient;
        } else if (Array.isArray(response.data.patients) && response.data.patients.length > 0) { // From plural structure
             rawPatientData = response.data.patients[0];
        } else if (response.data.data && Array.isArray(response.data.data.patients) && response.data.data.patients.length > 0) { // Another plural structure variant
            rawPatientData = response.data.data.patients[0];
        }
    }


    if (!rawPatientData) {
      console.error(`Patient data for ID ${patientId} not found in expected structure:`, response);
      return error(`Patient with ID ${patientId} not found or unexpected API response structure.`, 404, event);
    }
    
    const transformedData = transformPatientData(rawPatientData);

    if (!transformedData) {
      console.error('Failed to transform patient data for ID:', patientId, 'Raw data:', rawPatientData);
      return error('Failed to transform patient data.', 500, event);
    }

    return success(transformedData, 200, event);

  } catch (err) {
    console.error(`Error fetching patient ${patientId}:`, err.message, err.stack);
    const statusCode = err.response?.status || (err.message && err.message.includes('404') ? 404 : 500);
    const message = err.message || 'Failed to fetch patient data.';
    return error(message, statusCode, event);
  }
};
