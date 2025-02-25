const express = require('express');
const { 
  initiateRetellCall, 
  handleRetellWebhook,
  getAgentStatus,
  updateAgentConfig
} = require('../controllers/retellController');

const router = express.Router();

// Retell AI routes
router.post('/call', initiateRetellCall);
router.post('/webhook', handleRetellWebhook);
router.get('/agent/status', getAgentStatus);
router.put('/agent/config', updateAgentConfig);

module.exports = router;