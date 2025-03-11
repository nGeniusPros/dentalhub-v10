const { handleOptions, success, error, validateRequiredFields } = require('../utils/response');
const { initSupabase } = require('../utils/supabase');
const { sendNotification, sendMulticastNotification } = require('../utils/firebase');

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
    // Parse request body
    const payload = JSON.parse(event.body);
    
    // Validate required fields
    const validationError = validateRequiredFields(payload, ['title', 'body']);
    if (validationError) {
      return error(validationError, 400);
    }
    
    const {
      title,
      body,
      tokens,
      token,
      topic,
      data = {},
      storeInDatabase = true,
      userId,
      patientId,
      sendToAll = false,
      userGroup
    } = payload;
    
    // Ensure we have at least one target (token, tokens array, or topic)
    if (!token && !tokens && !topic && !sendToAll && !userGroup) {
      return error('Missing notification target (token, tokens, topic, userGroup, or sendToAll)', 400);
    }
    
    // Prepare notification object
    const notification = {
      title,
      body
    };
    
    // Track notification results
    let notificationResult;
    
    // Initialize Supabase for database operations
    const supabase = initSupabase();
    
    // Different sending logic based on the target type
    if (sendToAll) {
      // Get all device tokens from the database
      const { data: devices, error: devicesError } = await supabase
        .from('user_devices')
        .select('token')
        .eq('active', true);
        
      if (devicesError) {
        console.error('Error fetching device tokens:', devicesError);
        return error(`Failed to fetch device tokens: ${devicesError.message}`, 500);
      }
      
      if (!devices || devices.length === 0) {
        return error('No active devices found', 400);
      }
      
      // Extract just the tokens
      const allTokens = devices.map(device => device.token);
      
      // Send to all devices
      notificationResult = await sendMulticastNotification(allTokens, notification, data);
    } 
    else if (userGroup) {
      // Get tokens for a specific user group
      const { data: devices, error: devicesError } = await supabase
        .from('user_devices')
        .select('token, user_id')
        .eq('active', true)
        .eq('user_group', userGroup);
        
      if (devicesError) {
        console.error('Error fetching device tokens for user group:', devicesError);
        return error(`Failed to fetch device tokens: ${devicesError.message}`, 500);
      }
      
      if (!devices || devices.length === 0) {
        return error(`No active devices found for user group: ${userGroup}`, 400);
      }
      
      // Extract just the tokens
      const groupTokens = devices.map(device => device.token);
      
      // Send to user group devices
      notificationResult = await sendMulticastNotification(groupTokens, notification, data);
    }
    else if (tokens) {
      // Send to multiple tokens
      notificationResult = await sendMulticastNotification(
        Array.isArray(tokens) ? tokens : [tokens], 
        notification, 
        data
      );
    }
    else if (topic) {
      // Send to a topic
      notificationResult = await sendNotification(topic, notification, data, true);
    }
    else {
      // Send to a single token
      notificationResult = await sendNotification(token, notification, data);
    }
    
    // Store notification in database if requested
    if (storeInDatabase) {
      const { error: dbError } = await supabase
        .from('notifications')
        .insert({
          title,
          body,
          data,
          user_id: userId,
          patient_id: patientId,
          status: 'sent',
          sent_at: new Date().toISOString(),
          result: notificationResult
        });
        
      if (dbError) {
        console.error('Error storing notification:', dbError);
        // Continue anyway, as the notification was already sent
      }
    }
    
    return success({
      success: true,
      ...notificationResult,
      message: 'Notification sent successfully'
    });
  } catch (err) {
    console.error('Error sending notification:', err);
    return error(`Failed to send notification: ${err.message}`);
  }
};