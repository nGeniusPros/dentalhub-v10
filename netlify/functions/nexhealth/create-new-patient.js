// netlify/functions/nexhealth/create-new-patient.js

const { fetchFromNexHealth } = require('../../../src/lib/nexHealthClient');
const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');


// Define required environment variables
const REQUIRED_ENV_VARS = ['NEXHEALTH_SUBDOMAIN', 'NEXHEALTH_LOCATION_ID', 'NEXHEALTH_DEFAULT_PROVIDER_ID'];



exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: 'Method Not Allowed. Only POST requests are accepted.' }),
    };
  }

  try {
    const requestBody = JSON.parse(event.body);

    const { 
      first_name,
      last_name,
      email,
      date_of_birth, // Expected format: YYYY-MM-DD
      phone_number,
      provider_id 
    } = requestBody.patient || requestBody; // Accommodate if payload is { patient: { ... } } or flat

    const bio = requestBody.patient?.bio || requestBody.bio || {};

    if (!first_name || !last_name || !email || !(bio.date_of_birth || date_of_birth) || !(bio.phone_number || phone_number) ) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: 'Missing required patient information. Required fields: first_name, last_name, email, bio.date_of_birth, bio.phone_number.',
        }),
      };
    }

    const defaultSubdomain = process.env.NEXHEALTH_SUBDOMAIN || 'mission-viejo-dental-specialists-orthodontics-2';
    const defaultLocationId = process.env.NEXHEALTH_LOCATION_ID || '156530';
    const defaultProviderId = process.env.NEXHEALTH_DEFAULT_PROVIDER_ID || null;

    const queryParams = {
      subdomain: defaultSubdomain,
      location_id: defaultLocationId,
    };

    // Construct payload as expected by NexHealth API (based on memory and common patterns)
    // The practiceDataService sends NexHealthCreatePatientPayload which is { patient: { first_name, ..., bio: {...} }, provider?: {provider_id} }
    const nexHealthPayload = {
        patient: {
            first_name: first_name,
            last_name: last_name,
            email: email,
            bio: {
                date_of_birth: bio.date_of_birth || date_of_birth,
                phone_number: bio.phone_number || phone_number,
                ...(bio.city && { city: bio.city }),
                ...(bio.state && { state: bio.state }),
                ...(bio.zip_code && { zip_code: bio.zip_code }),
                ...(bio.address_line_1 && { address_line_1: bio.address_line_1 }),
                ...(bio.gender && { gender: bio.gender }),
            }
        }
    };

    const actualProviderId = requestBody.provider?.provider_id || provider_id || defaultProviderId;
    if (actualProviderId) {
      nexHealthPayload.provider = { provider_id: actualProviderId };
    }

    const nexHealthResponse = await fetchFromNexHealth('/patients', queryParams, 'POST', nexHealthPayload);

    if (nexHealthResponse && nexHealthResponse.data && nexHealthResponse.data.user) {
      return {
        statusCode: 201, 
        headers: { "Content-Type": "application/json" },
        // Align with practiceDataService expectation: { data: { user: ... } }
        body: JSON.stringify({ data: { user: nexHealthResponse.data.user } }),
      };
    } else if (nexHealthResponse && nexHealthResponse.description) {
        console.error('NexHealth API error during patient creation:', nexHealthResponse.description);
        return {
            statusCode: nexHealthResponse.code || 500, 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: 'Failed to create patient via NexHealth.', error: nexHealthResponse.description }),
        };
    } else {
      console.error('Unexpected response structure from NexHealth API during patient creation:', nexHealthResponse);
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: 'Unexpected response structure from NexHealth API.' }),
      };
    }

  } catch (error) {
    console.error('Error in create-new-patient function:', error.message);
    let errorMessage = 'Failed to create patient.';
    let statusCode = 500;

    if (error.response && error.response.data) {
        errorMessage = error.response.data.description || error.response.data.message || errorMessage;
        statusCode = error.response.status || statusCode;
    } else if (error.message) {
        errorMessage = error.message;
    }

    if (error.name === 'SyntaxError') { 
        statusCode = 400;
        errorMessage = 'Invalid JSON in request body.';
    }

    return {
      statusCode: statusCode,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message: 'Failed to create patient.',
        error: errorMessage 
      }),
    };
  }
};
