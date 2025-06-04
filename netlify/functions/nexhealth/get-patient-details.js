// netlify/functions/nexhealth/get-patient-details.js
// Handles requests to /api/nexhealth/get-patient-details?patientId=<ID>

const { fetchFromNexHealth } = require('../../../src/lib/nexHealthClient');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: 'Method Not Allowed. Only GET requests are accepted.' }),
    };
  }

  try {
    // practiceDataService.ts uses 'patientId' as the query parameter name
    const { patientId } = event.queryStringParameters || {};

    if (!patientId) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: 'Missing required query parameter: patientId' }),
      };
    }

    const defaultSubdomain = process.env.NEXHEALTH_SUBDOMAIN || 'mission-viejo-dental-specialists-orthodontics-2';

    const queryParams = {
      subdomain: defaultSubdomain,
    };

    const nexHealthResponse = await fetchFromNexHealth(`/patients/${patientId}`, queryParams);

    // Align with practiceDataService expectation: { data: NexHealthPatient }
    if (nexHealthResponse && nexHealthResponse.data) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: nexHealthResponse.data }), 
      };
    } else if (nexHealthResponse && nexHealthResponse.description) {
        console.error(`NexHealth API error fetching patient ${patientId}:`, nexHealthResponse.description);
        return {
            statusCode: nexHealthResponse.code || 500, 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: `Failed to fetch patient details for ID ${patientId}.`, error: nexHealthResponse.description }),
        };
    } else {
      console.error(`Unexpected response structure from NexHealth API for patient ${patientId}:`, nexHealthResponse);
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: 'Unexpected response structure from NexHealth API when fetching patient details.' }),
      };
    }

  } catch (error) {
    console.error('Error in get-patient-details function:', error.message);
    let errorMessage = 'Failed to fetch patient details.';
    let statusCode = 500;

    if (error.response && error.response.data) {
        errorMessage = error.response.data.description || error.response.data.message || errorMessage;
        statusCode = error.response.status || statusCode;
    } else if (error.message) {
        errorMessage = error.message;
    }

    return {
      statusCode: statusCode,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message: 'Failed to fetch patient details.',
        error: errorMessage 
      }),
    };
  }
};
