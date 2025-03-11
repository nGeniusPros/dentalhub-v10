const axios = require('axios');
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
    // Get Ayrshare API key from environment variables
    const apiKey = process.env.AYRSHARE_API_KEY;
    if (!apiKey) {
      return error('Missing Ayrshare API key', 500);
    }

    // Parse request body
    const {
      post,
      platforms = ['twitter', 'facebook', 'instagram', 'linkedin'],
      mediaUrls = [],
      title,
      scheduledTime,
      userId,
    } = JSON.parse(event.body);

    // Validate required parameters
    if (!post) {
      return error('Missing required parameter: post', 400);
    }

    // Prepare request for Ayrshare API
    const postData = {
      post,
      platforms: Array.isArray(platforms) ? platforms : [platforms],
    };

    // Add optional parameters if provided
    if (mediaUrls && mediaUrls.length > 0) {
      postData.mediaUrls = mediaUrls;
    }

    if (title) {
      postData.title = title;
    }

    if (scheduledTime) {
      postData.scheduledTime = scheduledTime;
    }

    // Make request to Ayrshare API
    const ayrshareResponse = await axios.post(
      'https://api.ayrshare.com/api/post',
      postData,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Store post information in Supabase
    if (ayrshareResponse.data && ayrshareResponse.data.id) {
      const supabase = initSupabase();
      
      const { error: dbError } = await supabase
        .from('social_posts')
        .insert({
          post_id: ayrshareResponse.data.id,
          content: post,
          platforms,
          media_urls: mediaUrls,
          status: ayrshareResponse.data.status || 'sent',
          user_id: userId || null,
          created_at: new Date().toISOString(),
          response_data: ayrshareResponse.data,
        });

      if (dbError) {
        console.error('Error storing social post record:', dbError);
      }
    }

    return success({
      postId: ayrshareResponse.data.id,
      status: ayrshareResponse.data.status,
      message: 'Social media post created successfully',
      details: ayrshareResponse.data
    });
  } catch (err) {
    console.error('Ayrshare API error:', err);
    
    // Handle Ayrshare API errors
    if (err.response && err.response.data) {
      return error(`Ayrshare API error: ${err.response.data.message || err.message}`, 
                  err.response.status || 500);
    }
    
    return error(`Failed to create social media post: ${err.message}`);
  }
};