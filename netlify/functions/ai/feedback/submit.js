const { initSupabase } = require('../../utils/supabase');
const { handleOptions, success, error } = require('../../utils/response');

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
    const supabase = initSupabase();
    
    // Parse request body
    const {
      feedbackType,
      message,
      rating,
      sessionId,
      userId,
      contextData,
    } = JSON.parse(event.body);

    // Validate required parameters
    if (!feedbackType || !message) {
      return error('Missing required parameters: feedbackType, message', 400);
    }

    // Store feedback in the database
    const { data, error: insertError } = await supabase
      .from('ai_feedback')
      .insert({
        feedback_type: feedbackType,
        message,
        rating: rating || null,
        session_id: sessionId || null,
        user_id: userId || null,
        context_data: contextData || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    return success({
      id: data.id,
      message: 'Feedback submitted successfully'
    }, 201);
  } catch (err) {
    console.error('AI Feedback function error:', err);
    return error(`Failed to submit feedback: ${err.message}`);
  }
};