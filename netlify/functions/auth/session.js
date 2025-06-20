const { initSupabase } = require('../utils/supabase');
const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  

  try {
    if (event.httpMethod !== 'POST') {
      return errorResponse('Method not allowed', 405);
    }

    const supabase = initSupabase();
    const body = JSON.parse(event.body);
    const { action, session, email, password } = body;

    let result;

    switch (action) {
      case 'SIGNIN':
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        break;
      case 'SIGNUP':
        result = await supabase.auth.signUp({
          email,
          password,
        });
        break;
      case 'SIGNOUT':
        result = await supabase.auth.signOut();
        break;
      case 'REFRESH':
        result = await supabase.auth.refreshSession(session);
        break;
      default:
        return errorResponse('Invalid action', 400);
    }

    return successResponse(result);
  } catch (err) {
    console.errorResponse('Auth function error:', err);
    return errorResponse(err.message);
  }
};