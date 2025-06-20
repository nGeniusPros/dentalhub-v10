const axios = require('axios');
const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');
const { initSupabase } = require('../utils/supabase');
// Define required environment variables
const REQUIRED_ENV_VARS = ['BEEHIIV_API_KEY'];



exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  

  // Get Beehiiv API key from environment variables
  const apiKey = process.env.BEEHIIV_API_KEY;
  if (!apiKey) {
    return errorResponse('Missing Beehiiv API key', 500);
  }

  // Create axios instance with Beehiiv API configuration
  const beehiiv = axios.create({
    baseURL: 'https://api.beehiiv.com/v2',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  try {
    // Handle different HTTP methods
    switch (event.httpMethod) {
      // Add or update subscriber
      case 'POST': {
        const {
          email,
          publicationId,
          firstName,
          lastName,
          utmSource,
          referringUrl,
          customFields,
          reactivate = true,
        } = JSON.parse(event.body);

        // Validate required parameters
        if (!email || !publicationId) {
          return errorResponse('Missing required parameters: email, publicationId', 400);
        }

        // Prepare request for Beehiiv API
        const subscriberData = {
          email,
          publication_id: publicationId,
          reactivate,
        };

        // Add optional parameters if provided
        if (firstName) subscriberData.first_name = firstName;
        if (lastName) subscriberData.last_name = lastName;
        if (utmSource) subscriberData.utm_source = utmSource;
        if (referringUrl) subscriberData.referring_url = referringUrl;
        if (customFields) subscriberData.custom_fields = customFields;

        // Make request to Beehiiv API
        const response = await beehiiv.post('/subscribers', subscriberData);

        // Store subscriber info in Supabase
        const supabase = initSupabase();
        
        await supabase
          .from('newsletter_subscribers')
          .upsert({
            email,
            publication_id: publicationId,
            first_name: firstName,
            last_name: lastName,
            status: response.data.status || 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'email',
            ignoreDuplicates: false
          });

        return successResponse({
          subscriberId: response.data.id,
          status: response.data.status,
          message: 'Subscriber added successfully'
        });
      }

      // Get subscriber information
      case 'GET': {
        const { email, publicationId } = event.queryStringParameters || {};

        // Validate required parameters
        if (!email || !publicationId) {
          return errorResponse('Missing required parameters: email, publicationId', 400);
        }

        // Make request to Beehiiv API
        const response = await beehiiv.get(`/subscribers/find?email=${encodeURIComponent(email)}&publication_id=${publicationId}`);

        return successResponse(response.data);
      }

      // Update subscriber status (unsubscribe)
      case 'PUT': {
        const { email, publicationId, status } = JSON.parse(event.body);

        // Validate required parameters
        if (!email || !publicationId || !status) {
          return errorResponse('Missing required parameters: email, publicationId, status', 400);
        }

        // Verify valid status
        if (!['active', 'inactive', 'unsubscribed'].includes(status)) {
          return errorResponse('Invalid status value. Must be one of: active, inactive, unsubscribed', 400);
        }

        // First find the subscriber to get their ID
        const findResponse = await beehiiv.get(
          `/subscribers/find?email=${encodeURIComponent(email)}&publication_id=${publicationId}`
        );

        if (!findResponse.data.id) {
          return errorResponse('Subscriber not found', 404);
        }

        // Update subscriber status
        const updateResponse = await beehiiv.patch(`/subscribers/${findResponse.data.id}`, {
          status
        });

        // Update record in Supabase
        const supabase = initSupabase();
        
        await supabase
          .from('newsletter_subscribers')
          .update({
            status,
            updated_at: new Date().toISOString()
          })
          .eq('email', email)
          .eq('publication_id', publicationId);

        return successResponse({
          subscriberId: updateResponse.data.id,
          status: updateResponse.data.status,
          message: 'Subscriber status updated successfully'
        });
      }

      default:
        return errorResponse('Method not allowed', 405);
    }
  } catch (err) {
    console.errorResponse('Beehiiv API error:', err);
    
    // Handle Beehiiv API errors
    if (err.response && err.response.data) {
      return errorResponse(`Beehiiv API error: ${err.response.data.message || err.message}`, 
                 err.response.status || 500);
    }
    
    return errorResponse(`Newsletter operation failed: ${err.message}`);
  }
};