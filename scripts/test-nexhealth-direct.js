// Direct test script for NexHealth API
const axios = require('axios');
require('dotenv').config();

// Configuration from environment variables
const config = {
  apiUrl: process.env.NEXHEALTH_API_URL || 'https://nexhealth.info',
  apiKey: process.env.NEXHEALTH_API_KEY,
  subdomain: process.env.NEXHEALTH_SUBDOMAIN,
  locationId: process.env.NEXHEALTH_LOCATION_ID
};

// Log configuration (without sensitive values)
console.log('Testing NexHealth API with configuration:');
console.log({
  apiUrl: config.apiUrl,
  hasApiKey: !!config.apiKey,
  subdomain: config.subdomain,
  locationId: config.locationId
});

// 1. First, authenticate to get a token
async function getAuthToken() {
  console.log('\n=== Step 1: Authenticating ===');
  try {
    const response = await axios.post(
      `${config.apiUrl}/authenticates`,
      {},
      {
        headers: {
          'Accept': 'application/vnd.Nexhealth+json;version=2',
          'Authorization': config.apiKey,
          'Nex-Api-Version': 'v2'
        }
      }
    );
    
    if (response.data.code === true && response.data.data.token) {
      console.log('✅ Authentication successful');
      return response.data.data.token;
    } else {
      throw new Error('Invalid authentication response');
    }
  } catch (error) {
    console.error('❌ Authentication failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
    throw error;
  }
}

// 2. Test the patients endpoint
async function testPatientsEndpoint(token) {
  console.log('\n=== Step 2: Testing /patients endpoint ===');
  try {
    const response = await axios.get(
      `${config.apiUrl}/patients`,
      {
        params: {
          subdomain: config.subdomain,
          location_id: config.locationId,
          per_page: 1,
          page: 1
        },
        headers: {
          'Accept': 'application/vnd.Nexhealth+json;version=2',
          'Authorization': `Bearer ${token}`,
          'Nex-Api-Version': 'v2'
        }
      }
    );
    
    console.log('✅ Successfully fetched patients');
    console.log('\n=== Sample Patient Data ===');
    const patient = response.data.data?.[0];
    if (patient) {
      console.log('Patient ID:', patient.id);
      console.log('Name:', patient.name || `${patient.first_name} ${patient.last_name}`);
      console.log('Email:', patient.email);
      console.log('Phone:', patient.phone || patient.cell_phone || patient.home_phone);
      console.log('Date of Birth:', patient.date_of_birth || patient.dob);
      console.log('Last Visit:', patient.last_visit_date);
    }
    
    console.log('\n=== Response Structure ===');
    console.log('Data array length:', response.data.data?.length || 0);
    console.log('Pagination:', response.data.meta || response.data.pagination || 'No pagination info');
    
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch patients:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
    throw error;
  }
}

// Main execution
async function main() {
  try {
    console.log('🚀 Starting NexHealth API test...');
    const token = await getAuthToken();
    await testPatientsEndpoint(token);
    console.log('\n✨ Test completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed!');
    process.exit(1);
  }
}

// Run the test
main();
