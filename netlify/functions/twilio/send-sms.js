const { handleOptions, success, error } = require('../utils/response');

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405);
  }

  try {
    // Get Twilio credentials from environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    // Validate environment variables
    if (!accountSid || !authToken || !fromNumber) {
      return error('Missing Twilio configuration', 500);
    }

    // Initialize Twilio client
    const client = require('twilio')(accountSid, authToken);

    // Get request body
    const { to, body } = JSON.parse(event.body);

    // Validate required parameters
    if (!to || !body) {
      return error('Missing required parameters: to, body', 400);
    }

    // Send SMS
    const message = await client.messages.create({
      body,
      from: fromNumber,
      to
    });

    return success({
      messageId: message.sid,
      status: message.status,
      message: 'SMS sent successfully'
    });
  } catch (err) {
    console.error('Twilio function error:', err);
    return error(`Failed to send SMS: ${err.message}`);
  }
};