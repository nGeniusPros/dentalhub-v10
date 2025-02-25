const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;

// Function to get Twilio client (lazy initialization)
const getTwilioClient = () => {
  console.log('Getting Twilio client with credentials:', {
    ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ? 'Present (not showing full value)' : 'Missing',
    AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ? 'Present (not showing full value)' : 'Missing'
  });

  try {
    // Make sure we pass strings to avoid type issues
    const client = twilio(
      String(process.env.TWILIO_ACCOUNT_SID),
      String(process.env.TWILIO_AUTH_TOKEN)
    );
    console.log('Twilio client initialized successfully');
    return client;
  } catch (error) {
    console.error('Failed to initialize Twilio client:', error.message);
    // Provide a mock client for development to prevent crashes
    return {
      calls: {
        create: () => Promise.resolve({ sid: 'MOCK_SID', status: 'mock-initialized' })
      }
    };
  }
};

// No global twilioClient variable - we'll get it when needed

/**
 * Handle incoming voice calls
 * This function is called when someone calls your Twilio number
 */
const handleIncomingCall = (req, res) => {
  console.log('Incoming call:', req.body);
  
  const twiml = new VoiceResponse();
  
  // Example: Greet the caller and add them to a queue
  twiml.say(
    { voice: 'alice' },
    'Thank you for calling Dental Hub. Please wait while we connect you with the next available representative.'
  );
  
  // Example: You can play music while they wait
  twiml.play('https://demo.twilio.com/docs/classic.mp3');
  
  // Alternative: Forward the call to another number
  // twiml.dial('office-phone-number');
  
  // Alternative: Connect to Retell AI voice agent
  // twiml.redirect('/api/retell/call');
  
  res.type('text/xml');
  res.send(twiml.toString());
};

/**
 * Receive status updates about calls
 * This function is called when a call status changes
 */
const handleVoiceStatus = (req, res) => {
  console.log('Call status update:', req.body);
  // Store call records in database, update UI, etc.
  res.sendStatus(200);
};

/**
 * Initiate an outbound call
 * This function is called from the frontend to start a call
 */
const initiateOutboundCall = async (req, res) => {
  try {
    const { to, from = process.env.TWILIO_PHONE_NUMBER, options } = req.body;
    
    if (!to) {
      return res.status(400).json({ error: 'Destination phone number is required' });
    }
    
    // Create a URL that returns TwiML for Twilio to execute when the call connects
    const callbackUrl = `${req.protocol}://${req.get('host')}/api/twilio/voice/callback`;
    
    // Get the Twilio client on-demand
    const twilioClient = getTwilioClient();
    
    const call = await twilioClient.calls.create({
      to: to,
      from: from,
      url: callbackUrl,
      statusCallback: `${req.protocol}://${req.get('host')}/api/twilio/voice/status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
      ...options
    });
    
    res.json({
      success: true,
      callSid: call.sid,
      status: call.status
    });
  } catch (error) {
    console.error('Error initiating call:', error);
    res.status(500).json({
      error: {
        message: 'Failed to initiate call',
        details: error.message
      }
    });
  }
};

/**
 * Generate TwiML instructions for outbound calls
 * This function is called by Twilio when an outbound call connects
 */
const handleOutboundCallConnected = (req, res) => {
  const twiml = new VoiceResponse();
  
  twiml.say(
    { voice: 'alice' },
    'This is an automated call from Dental Hub. Your appointment is scheduled for tomorrow at 2 PM. Press 1 to confirm, press 2 to reschedule.'
  );
  
  // You can add gather to collect DTMF input
  const gather = twiml.gather({
    numDigits: 1,
    action: '/api/twilio/voice/gather',
    method: 'POST'
  });
  
  // Add message to the gather
  gather.say('Press 1 to confirm, press 2 to reschedule.');
  
  // If no input, repeat the message
  twiml.say('We didn\'t receive any input. Goodbye!');
  
  res.type('text/xml');
  res.send(twiml.toString());
};

module.exports = {
  handleIncomingCall,
  handleVoiceStatus,
  initiateOutboundCall,
  handleOutboundCallConnected,
  getTwilioClient
};