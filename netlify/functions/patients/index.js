const { initSupabase } = require('../utils/supabase');
const { handleOptions, success, error } = require('../utils/response');

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  const supabase = initSupabase();
  
  try {
    // Get patient listing (with pagination)
    if (event.httpMethod === 'GET') {
      const { page = 0, limit = 20, search = '' } = event.queryStringParameters || {};
      
      let query = supabase
        .from('patients')
        .select('*', { count: 'exact' });
      
      // Add search filter if provided
      if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
      }
      
      // Add pagination
      const from = page * limit;
      const to = from + limit - 1;
      
      const { data, error: queryError, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (queryError) {
        throw new Error(queryError.message);
      }
      
      return success({
        data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      });
    }
    
    // Create new patient
    if (event.httpMethod === 'POST') {
      const patientData = JSON.parse(event.body);
      
      const { data, error: insertError } = await supabase
        .from('patients')
        .insert(patientData)
        .select()
        .single();
      
      if (insertError) {
        throw new Error(insertError.message);
      }
      
      return success(data, 201);
    }
    
    // Update patient
    if (event.httpMethod === 'PUT') {
      const { id } = event.queryStringParameters || {};
      
      if (!id) {
        return error('Patient ID is required', 400);
      }
      
      const updates = JSON.parse(event.body);
      
      const { data, error: updateError } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      return success(data);
    }
    
    // Delete patient
    if (event.httpMethod === 'DELETE') {
      const { id } = event.queryStringParameters || {};
      
      if (!id) {
        return error('Patient ID is required', 400);
      }
      
      const { error: deleteError } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);
      
      if (deleteError) {
        throw new Error(deleteError.message);
      }
      
      return success({ message: 'Patient deleted successfully' });
    }
    
    // Method not supported
    return error('Method not allowed', 405);
    
  } catch (err) {
    console.error('Patient function error:', err);
    return error(err.message);
  }
};