const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');
const { initSupabase } = require('../utils/supabase');
const { verifyWebhookSignature } = require('../utils/retell');
// Define required environment variables
const REQUIRED_ENV_VARS = ['RETELL_WEBHOOK_SECRET'];



exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Verify Retell webhook signature
    const retellWebhookSecret = process.env.RETELL_WEBHOOK_SECRET;
    const signature = event.headers['x-retell-signature'];
    
    if (!retellWebhookSecret || !signature) {
      console.errorResponse('Missing webhook signature or secret');
      return errorResponse('Unauthorized', 401);
    }
    
    // Verify the signature using the raw body
    const isSignatureValid = verifyWebhookSignature(
      signature,
      event.body, // Use raw body for signature verification
      retellWebhookSecret
    );
    
    if (!isSignatureValid) {
      console.errorResponse('Invalid webhook signature');
      return errorResponse('Invalid signature', 401);
    }
    
    // Parse webhook payload
    let payload;
    try {
      payload = JSON.parse(event.body);
    } catch (e) {
      console.errorResponse('Error parsing webhook payload:', e);
      return errorResponse('Invalid payload', 400);
    }
    
    const { type, call_id } = payload || {};
    
    if (!type || !call_id) {
      console.errorResponse('Missing required fields in webhook payload');
      return errorResponse('Invalid payload', 400);
    }
    
    // Initialize Supabase
    const supabase = initSupabase();
    
    // Log the incoming webhook for debugging
    console.log(`Processing webhook: ${type} for call ${call_id}`, payload);
    
    // Handle different event types
    switch (type) {
      case 'call.started': {
        // Update call status to 'in_progress'
        const { error: updateError } = await supabase
          .from('retell_calls')
          .update({ 
            status: 'in_progress',
            updated_at: new Date().toISOString()
          })
          .eq('call_id', call_id);
          
        if (updateError) {
          console.errorResponse('Error updating call status:', updateError);
        }
        
        // Log the call event
        const { error: eventError } = await supabase
          .from('call_events')
          .insert({
            call_id: call_id,
            event_type: 'started',
            timestamp: new Date().toISOString(),
            metadata: payload,
            duration: payload.duration_seconds || 0
          });
          
        if (eventError) {
          console.errorResponse('Error logging call event:', eventError);
        }
        break;
      }
      
      case 'call.ended': {
        // Update call status to 'completed'
        const { error: updateError } = await supabase
          .from('retell_calls')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('call_id', call_id);
          
        if (updateError) {
          console.errorResponse('Error updating call status:', updateError);
        }
        
        // Log the call event
        const { error: eventError } = await supabase
          .from('call_events')
          .insert({
            call_id: call_id,
            event_type: 'ended',
            timestamp: new Date().toISOString(),
            duration: payload.duration_seconds || 0,
            metadata: payload
          });
          
        if (eventError) {
          console.errorResponse('Error logging call event:', eventError);
        }
        break;
      }
      
      case 'call.transcription': {
        // Store call transcription
        const { error: transError } = await supabase
          .from('call_transcriptions')
          .insert({
            call_id: call_id,
            timestamp: new Date().toISOString(),
            transcript: payload.transcript,
            metadata: payload,
          });
          
        if (transError) {
          console.errorResponse('Error saving transcription:', transError);
        }
        break;
      }
      
      case 'call.recording': {
        // Store call recording URL
        const { error: recError } = await supabase
          .from('call_recordings')
          .insert({
            call_id: call_id,
            timestamp: new Date().toISOString(),
            recording_url: payload.recording_url,
            metadata: payload,
          });
          
        if (recError) {
          console.errorResponse('Error saving recording:', recError);
        }
        break;
      }
      
      default: {
        // Log unknown event type
        console.log(`Unhandled Retell event type: ${type}`, payload);
        
        // Store unknown event type for debugging
        await supabase
          .from('call_events')
          .insert({
            call_id: call_id || 'unknown',
            event_type: type,
            timestamp: new Date().toISOString(),
            metadata: payload
          });
        break;
      }
    }
    
    return successResponse({ 
      success: true, 
      eventType: type,
      callId: call_id,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.errorResponse('Retell webhook error:', err);
    
    // Log the error to the database if possible
    try {
      const supabase = initSupabase();
      await supabase
        .from('call_events')
        .insert({
          event_type: 'webhook_error',
          timestamp: new Date().toISOString(),
          metadata: {
            error: err.message,
            stack: err.stack,
            body: event.body
          }
        });
    } catch (dbErr) {
      console.errorResponse('Failed to log webhook error:', dbErr);
    }
    
    return errorResponse(`Failed to process webhook: ${err.message}`, 500);
  }
};