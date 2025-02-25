const express = require('express');
const { handleIncomingCall, handleVoiceStatus, initiateOutboundCall } = require('../controllers/voiceController');
const { handleIncomingSMS, sendOutboundSMS, handleSMSStatus } = require('../controllers/smsController');

const router = express.Router();

// Voice routes
router.post('/voice/incoming', handleIncomingCall);
router.post('/voice/status', handleVoiceStatus);
router.post('/voice/call', initiateOutboundCall);

// Test endpoint to verify Twilio configuration
router.get('/test', (req, res) => {
  try {
    // Import the getTwilioClient function from voiceController
    const { getTwilioClient } = require('../controllers/voiceController');
    
    // Try to get the Twilio client
    const twilioClient = getTwilioClient();
    
    // Return the validation result
    res.json({
      success: true,
      message: 'Twilio client initialized successfully',
      accountSid: process.env.TWILIO_ACCOUNT_SID ?
        `${process.env.TWILIO_ACCOUNT_SID.substring(0, 4)}...${process.env.TWILIO_ACCOUNT_SID.substring(process.env.TWILIO_ACCOUNT_SID.length - 4)}` :
        'Missing',
      authTokenPresent: !!process.env.TWILIO_AUTH_TOKEN,
      phoneNumberPresent: !!process.env.TWILIO_PHONE_NUMBER
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to initialize Twilio client',
      error: error.message
    });
  }
});

// SMS routes
router.post('/sms/incoming', handleIncomingSMS);
router.post('/sms/send', sendOutboundSMS);
router.post('/sms/status', handleSMSStatus);

module.exports = router;