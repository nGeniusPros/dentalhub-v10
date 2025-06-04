const { nexhealthClient } = require('../netlify/functions/nexhealth/client');

async function testNexHealthPatients() {
  try {
    console.log('Fetching patients from NexHealth API...');
    
    // Make a test request with minimal parameters
    const response = await nexhealthClient.get('/patients', {
      per_page: 1, // Just get one patient to see the structure
      page: 1
    });
    
    console.log('\n=== Raw API Response ===');
    console.log(JSON.stringify(response, null, 2));
    
    if (response && response.data) {
      console.log('\n=== Data Structure ===');
      console.log('Response contains data array:', Array.isArray(response.data));
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        const patient = response.data[0];
        console.log('\n=== Sample Patient Fields ===');
        console.log('Patient ID:', patient.id);
        console.log('Name:', patient.name || `${patient.first_name} ${patient.last_name}`);
        console.log('First Name:', patient.first_name);
        console.log('Last Name:', patient.last_name);
        console.log('Email:', patient.email);
        console.log('Phone:', patient.phone || patient.cell_phone || patient.home_phone);
        console.log('Date of Birth:', patient.date_of_birth || patient.dob);
        console.log('Last Visit Date:', patient.last_visit_date || patient.last_appointment_date);
        console.log('Bio:', patient.bio ? JSON.stringify(patient.bio, null, 2) : 'N/A');
        console.log('All available fields:', Object.keys(patient));
      }
      
      // Check for pagination metadata
      console.log('\n=== Pagination Info ===');
      console.log('Total Items:', response.meta?.total_count || response.total || 'Not available');
      console.log('Current Page:', response.meta?.current_page || response.page || 'Not available');
      console.log('Per Page:', response.meta?.per_page || response.per_page || 'Not available');
      console.log('Total Pages:', response.meta?.total_pages || response.total_pages || 'Not available');
    }
    
  } catch (error) {
    console.error('Error testing NexHealth patients API:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    console.error('Config:', error.config);
  }
}

// Run the test
testNexHealthPatients();
