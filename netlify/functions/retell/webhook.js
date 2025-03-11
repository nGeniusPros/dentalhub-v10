const { handleOptions, success, error } = require('../utils/response');
const { initSupabase } = require('../utils/supabase');

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
    // Verify Retell webhook signature (you should implement this properly in production)
    const retellWebhookSecret = process.env.RETELL_WEBHOOK_SECRET;
    const signature = event.headers['x-retell-signature'];
    
    if (!retellWebhookSecret || !signature) {
      return error('Missing webhook signature or secret', 401);
    }
    
    // Simple verification - in production, implement proper signature verification
    // This is just a placeholder for now
    if (signature !== retellWebhookSecret) {
      return error('Invalid webhook signature', 401);
    }
    
    // Parse webhook payload
    const payload = JSON.parse(event.body);
    const { type } = payload;
    
    // Initialize Supabase
    const supabase = initSupabase();
    
    // Handle different event types
    switch (type) {
      case 'call.started': {
        // Store call started event
        await supabase
          .from('call_events')
          .insert({
            event_type: 'started',
            call_id: payload.call_id,
            timestamp: new Date().toISOString(),
            metadata: payload,
          });
        break;
      }
      
      case 'call.ended': {
        // Store call ended event
        await supabase
          .from('call_events')
          .insert({
            event_type: 'ended',
            call_id: payload.call_id,
            timestamp: new Date().toISOString(),
            duration: payload.duration,
            metadata: payload,
          });
        break;
      }
      
      case 'call.transcription': {
        // Store call transcription
        await supabase
          .from('call_transcriptions')
          .insert({
            call_id: payload.call_id,
            timestamp: new Date().toISOString(),
            transcript: payload.transcript,
            metadata: payload,
          });
        break;
      }
      
      case 'call.recording': {
        // Store call recording URL
        await supabase
          .from('call_recordings')
          .insert({
            call_id: payload.call_id,
            timestamp: new Date().toISOString(),
            recording_url: payload.recording_url,
            metadata: payload,
          });
        break;
      }
      
      default:
        // Log unknown event type
        console.log(`Unhandled Retell event type: ${type}`);
    }
    
    return success({ received: true, eventType: type });
  } catch (err) {
    console.error('Retell webhook error:', err);
    return error(`Failed to process webhook: ${err.message}`);
  }
};