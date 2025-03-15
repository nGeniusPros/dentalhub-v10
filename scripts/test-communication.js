// This script tests the communication functionality for marketing
require('dotenv').config();
const axios = require('axios');

// Check environment variables
const apiBaseUrl = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Create an API client
const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Test SMS functionality
async function testSMS() {
  console.log('\n=== TESTING SMS FUNCTIONALITY ===');
  
  if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
    console.log('⚠️ Twilio credentials not found in environment variables');
    console.log('SMS testing will be skipped. To enable SMS testing, add the following to your .env file:');
    console.log('TWILIO_ACCOUNT_SID=your_twilio_account_sid');
    console.log('TWILIO_AUTH_TOKEN=your_twilio_auth_token');
    console.log('TWILIO_PHONE_NUMBER=your_twilio_phone_number');
    return false;
  }
  
  console.log('Testing SMS API endpoint...');
  
  try {
    // Test connection to the SMS endpoint
    const healthResponse = await api.get('/communications/health');
    console.log('API health check response:', healthResponse.data);
    
    console.log('\nAPI connection successful');
    return true;
  } catch (error) {
    console.error('Error connecting to SMS API:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    console.log('\nTo set up the communication server:');
    console.log('1. Navigate to the server directory: cd server');
    console.log('2. Install dependencies: npm install');
    console.log('3. Set up environment variables in server/.env');
    console.log('4. Start the server: npm start');
    
    return false;
  }
}

// Test call functionality
async function testCall() {
  console.log('\n=== TESTING CALL FUNCTIONALITY ===');
  
  if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
    console.log('⚠️ Twilio credentials not found in environment variables');
    console.log('Call testing will be skipped. To enable call testing, configure Twilio credentials.');
    return false;
  }
  
  console.log('Testing voice call API endpoint...');
  
  try {
    // Test connection to the voice endpoint
    const voiceHealthResponse = await api.get('/communications/voice/health');
    console.log('Voice API health check response:', voiceHealthResponse.data);
    
    console.log('\nVoice API connection successful');
    return true;
  } catch (error) {
    console.error('Error connecting to voice API:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    return false;
  }
}

// Start the communication server if it's not running
async function startCommunicationServer() {
  console.log('\n=== CHECKING COMMUNICATION SERVER ===');
  
  try {
    // Check if the server is running
    await api.get('/');
    console.log('Communication server is already running');
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('Communication server is not running');
      console.log('Attempting to start the server...');
      
      try {
        // Use child_process to start the server
        const { spawn } = require('child_process');
        const serverProcess = spawn('npm', ['start'], {
          cwd: './server',
          detached: true,
          stdio: 'inherit'
        });
        
        // Give the server some time to start
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        console.log('Communication server started');
        return true;
      } catch (startError) {
        console.error('Failed to start communication server:', startError.message);
        return false;
      }
    } else {
      console.error('Error checking communication server:', error.message);
      return false;
    }
  }
}

// Test getting prospects
async function testGetProspects() {
  console.log('\n=== TESTING PROSPECT RETRIEVAL ===');
  
  try {
    // Use the Supabase client directly to get prospects
    const { supabase } = require('../src/lib/supabase');
    
    if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase credentials. Cannot test prospect retrieval.');
      return false;
    }
    
    
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('Error retrieving prospects:', error.message);
      return false;
    }
    
    console.log(`Successfully retrieved ${data.length} prospects`);
    if (data.length > 0) {
      console.log('Sample prospect:', {
        id: data[0].id,
        name: `${data[0].first_name} ${data[0].last_name}`,
        email: data[0].email,
        phone: data[0].phone
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error testing prospect retrieval:', error.message);
    return false;
  }
}

// Main function to run tests
async function runTests() {
  try {
    console.log('=== COMMUNICATION TESTING UTILITY ===');
    console.log('This script tests the communication functionality for marketing');
    
    // Check Supabase credentials
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
      console.error('ERROR: Missing Supabase environment variables');
      console.log('Please make sure you have .env file with the following variables:');
      console.log('VITE_SUPABASE_URL=your_supabase_url');
      console.log('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
      process.exit(1);
    }
    
    // Test getting prospects from Supabase
    const prospectsOk = await testGetProspects();
    
    // Start communication server if needed
    const serverOk = await startCommunicationServer();
    
    // Test SMS functionality
    const smsOk = await testSMS();
    
    // Test call functionality
    const callOk = await testCall();
    
    // Summary
    console.log('\n=== TEST SUMMARY ===');
    console.log(`Prospects Database: ${prospectsOk ? '✅ OK' : '❌ Failed'}`);
    console.log(`Communication Server: ${serverOk ? '✅ OK' : '❌ Failed'}`);
    console.log(`SMS Functionality: ${smsOk ? '✅ OK' : '❌ Not configured'}`);
    console.log(`Call Functionality: ${callOk ? '✅ OK' : '❌ Not configured'}`);
    
    if (prospectsOk && serverOk) {
      console.log('\n✅ The marketing functionality appears to be properly set up!');
      console.log('You can now run the application and use the marketing features.');
      console.log('Access the prospects page at: http://localhost:5173/admin-dashboard/prospects');
    } else {
      console.log('\n❌ There are issues with the marketing functionality setup.');
      console.log('Please follow the instructions in docs/MARKETING_SETUP_GUIDE.md to fix them.');
    }
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the tests
runTests();