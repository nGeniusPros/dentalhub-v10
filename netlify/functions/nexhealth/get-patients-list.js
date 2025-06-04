// netlify/functions/nexhealth/get-patients-list.js

const { fetchFromNexHealth } = require('../../../src/lib/nexHealthClient');

exports.handler = async (event, context) => {
  try {
    const defaultSubdomain = process.env.NEXHEALTH_SUBDOMAIN || 'mission-viejo-dental-specialists-orthodontics-2';
    const defaultLocationId = process.env.NEXHEALTH_LOCATION_ID || '156530';

    const {
      page = '1',
      per_page = '25',
      sort = 'name',
      subdomain = defaultSubdomain,
      location_id = defaultLocationId,
      name,
      email,
      phone_number,
      foreign_id,
      chart_id,
      inactive,
    } = event.queryStringParameters || {};

    const queryParams = {
      subdomain,
      location_id,
      page,
      per_page,
      sort,
    };

    if (name) queryParams.name = name;
    if (email) queryParams.email = email;
    if (phone_number) queryParams.phone_number = phone_number;
    if (foreign_id) queryParams.foreign_id = foreign_id;
    if (chart_id) queryParams.chart_id = chart_id;
    if (inactive !== undefined) queryParams.inactive = inactive;

    const nexHealthResponse = await fetchFromNexHealth('/patients', queryParams);

    // Ensure the response from NexHealth has the expected structure
    if (nexHealthResponse && nexHealthResponse.data && nexHealthResponse.data.patients && nexHealthResponse.count !== undefined) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            patients: nexHealthResponse.data.patients, // Array of patient objects
          },
          count: nexHealthResponse.count,       // Total count of patients
          page: parseInt(page, 10),             // Current page number
          per_page: parseInt(per_page, 10),     // Items per page
        }),
      };
    } else {
      console.error('Unexpected response structure from NexHealth API /patients:', nexHealthResponse);
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: 'Unexpected response structure from NexHealth API when listing patients.' }),
      };
    }

  } catch (error) {
    console.error('Error in get-patients-list function:', error.message);
    let errorMessage = 'Failed to fetch patients list.';
    if (error.response && error.response.data && error.response.data.description) {
      errorMessage = error.response.data.description;
    }
    return {
      statusCode: error.response ? error.response.status : 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message: 'Failed to fetch patients list.',
        error: errorMessage
      }),
    };
  }
};
