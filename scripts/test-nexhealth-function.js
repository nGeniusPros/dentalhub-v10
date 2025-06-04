// Test script for the NexHealth patients function
const { handler } = require('../netlify/functions/nexhealth/nexhealth-patients');
require('dotenv').config();

// Mock event object
const mockEvent = {
  httpMethod: 'GET',
  path: '/api/nexhealth/patients',
  queryStringParameters: {
    page: '1',
    per_page: '5',
    // Add any test parameters here
  },
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: null,
  isBase64Encoded: false,
};

// Mock context
const mockContext = {
  callbackWaitsForEmptyEventLoop: true,
  functionName: 'test-nexhealth-patients',
  functionVersion: '$LATEST',
  invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:test-nexhealth-patients',
  memoryLimitInMB: '256',
  awsRequestId: 'test-request-id',
  logGroupName: '/aws/lambda/test-nexhealth-patients',
  logStreamName: '2023/01/01/[$LATEST]testlogstream',
  getRemainingTimeInMillis: () => 5000,
  done: () => {},
  fail: () => {},
  succeed: () => {},
};

// Test the handler
async function testHandler() {
  console.log('Testing NexHealth patients function...');
  
  try {
    const result = await handler(mockEvent, mockContext, (error, response) => {
      if (error) {
        console.error('Error in handler callback:', error);
        return;
      }
      console.log('Handler response:', JSON.stringify(response, null, 2));
    });
    
    if (result) {
      console.log('Handler result:', JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('Error executing handler:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Run the test
testHandler();
