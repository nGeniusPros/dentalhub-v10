const { initSupabase } = require('../utils/supabase');
const { handleOptions, success, error } = require('../utils/response');

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  try {
    if (event.httpMethod !== 'POST') {
      return error('Method not allowed', 405);
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
        return error('Invalid action', 400);
    }

    return success(result);
  } catch (err) {
    console.error('Auth function error:', err);
    return error(err.message);
  }
};