const twilio = require('twilio');
const MessagingResponse = twilio.twiml.MessagingResponse;

// Function to get Twilio client (lazy initialization)
const getTwilioClient = () => {
  console.log('Getting Twilio SMS client with credentials:', {
    ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ? 'Present (not showing full value)' : 'Missing',
    AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ? 'Present (not showing full value)' : 'Missing'
  });

  try {
    // Make sure we pass strings to avoid type issues
    const client = twilio(
      String(process.env.TWILIO_ACCOUNT_SID),
      String(process.env.TWILIO_AUTH_TOKEN)
    );
    console.log('Twilio SMS client initialized successfully');
    return client;
  } catch (error) {
    console.error('Failed to initialize Twilio SMS client:', error.message);
    // Provide a mock client for development to prevent crashes
    return {
      messages: {
        create: () => Promise.resolve({ sid: 'MOCK_SID', status: 'mock-initialized' })
      }
    };
  }
};

// No global twilioClient variable - we'll get it when needed

/**
 * Handle incoming SMS messages
 * This function is called when someone sends an SMS to your Twilio number
 */
const handleIncomingSMS = (req, res) => {
  console.log('Incoming SMS:', req.body);
  
  const twiml = new MessagingResponse();
  const incomingMessage = req.body.Body || '';
  const fromNumber = req.body.From;
  
  // Example: Simple autoresponder based on message content
  if (incomingMessage.toLowerCase().includes('appointment')) {
    twiml.message(
      'To schedule an appointment, please reply with your preferred date and time, or call our office at (555) 123-4567.'
    );
  } else if (incomingMessage.toLowerCase().includes('hours')) {
    twiml.message(
      'Our office hours are Monday-Friday 9am-5pm and Saturday 9am-1pm. We are closed on Sundays.'
    );
  } else if (incomingMessage.toLowerCase().includes('confirm')) {
    twiml.message(
      'Your appointment has been confirmed. We look forward to seeing you!'
    );
    
    // Here you would also update your database to mark the appointment as confirmed
  } else if (incomingMessage.toLowerCase().includes('cancel')) {
    twiml.message(
      'We\'ve received your cancellation request. Please call our office at (555) 123-4567 to reschedule.'
    );
    
    // Here you would also update your database to mark the appointment as cancelled
  } else if (incomingMessage.toLowerCase().includes('emergency')) {
    twiml.message(
      'If you are experiencing a dental emergency, please call our office immediately at (555) 123-4567.'
    );
  } else {
    twiml.message(
      'Thank you for contacting Dental Hub. For appointments, reply "appointment". For office hours, reply "hours". For emergencies, reply "emergency".'
    );
  }
  
  res.type('text/xml');
  res.send(twiml.toString());
  
  // You could also store this message in a database or forward it to staff
};

/**
 * Send an SMS message
 * This function is called from the frontend to send SMS messages
 */
const sendOutboundSMS = async (req, res) => {
  try {
    const { to, body, from = process.env.TWILIO_PHONE_NUMBER, mediaUrl } = req.body;
    
    if (!to || !body) {
      return res.status(400).json({ error: 'Recipient phone number and message body are required' });
    }
    
    const messageOptions = {
      to: to,
      from: from,
      body: body,
      statusCallback: `${req.protocol}://${req.get('host')}/api/twilio/sms/status`
    };
    
    // If media URL is provided, add it to the message
    if (mediaUrl) {
      messageOptions.mediaUrl = mediaUrl;
    }
    
    // Get the Twilio client on-demand
    const twilioClient = getTwilioClient();
    
    const message = await twilioClient.messages.create(messageOptions);
    
    res.json({
      success: true,
      messageSid: message.sid,
      status: message.status
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({
      error: {
        message: 'Failed to send SMS',
        details: error.message
      }
    });
  }
};

/**
 * Handle SMS status callbacks
 * This function is called by Twilio when an SMS status changes
 */
const handleSMSStatus = (req, res) => {
  console.log('SMS status update:', req.body);
  // Store message status in database for tracking
  // This could update UI with delivery status
  res.sendStatus(200);
};

/**
 * Send a batch of SMS messages
 * This function can be used for campaigns or reminders
 */
const sendBatchSMS = async (req, res) => {
  try {
    const { recipients, body, from = process.env.TWILIO_PHONE_NUMBER, mediaUrl } = req.body;
    
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0 || !body) {
      return res.status(400).json({ error: 'Recipients list and message body are required' });
    }
    
    const results = [];
    const errors = [];
    
    // Get the Twilio client on-demand
    const twilioClient = getTwilioClient();
    
    // Send messages in sequence
    for (const recipient of recipients) {
      try {
        const messageOptions = {
          to: recipient,
          from: from,
          body: body,
          statusCallback: `${req.protocol}://${req.get('host')}/api/twilio/sms/status`
        };
        
        if (mediaUrl) {
          messageOptions.mediaUrl = mediaUrl;
        }
        
        const message = await twilioClient.messages.create(messageOptions);
        
        results.push({
          to: recipient,
          messageSid: message.sid,
          status: message.status
        });
      } catch (err) {
        errors.push({
          to: recipient,
          error: err.message
        });
      }
    }
    
    res.json({
      success: true,
      totalSent: results.length,
      totalFailed: errors.length,
      results,
      errors
    });
  } catch (error) {
    console.error('Error sending batch SMS:', error);
    res.status(500).json({
      error: {
        message: 'Failed to send batch SMS',
        details: error.message
      }
    });
  }
};

module.exports = {
  handleIncomingSMS,
  sendOutboundSMS,
  handleSMSStatus,
  sendBatchSMS
};