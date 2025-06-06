const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
            headers: { 'Content-Type': 'application/json' }
        };
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GOOGLE_GEMINI_API_KEY is not set.');
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'API key not configured on server.' }),
            headers: { 'Content-Type': 'application/json' }
        };
    }

    let requestBody;
    try {
        requestBody = JSON.parse(event.body);
    } catch (e) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid JSON in request body.' }),
            headers: { 'Content-Type': 'application/json' }
        };
    }

    const { question, proposalContext, researchContext } = requestBody;

    if (!question || !proposalContext || !researchContext) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing required fields: question, proposalContext, or researchContext.' }),
            headers: { 'Content-Type': 'application/json' }
        };
    }

    const fullPrompt = `You are an expert marketing strategist from nGenius Pros, answering a question from a potential client, Dr. Nikaeen. Your tone should be confident, professional, and reassuring. Use the provided context from our proposal and our market research to formulate your answer.\n\n${proposalContext}\n\n${researchContext}\n\nDr. Nikaeen's question is: "${question}"\n\nPlease provide a clear, detailed, and data-backed answer that reinforces the value of our proposed strategy and helps build her confidence to sign on as a client.`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    const payload = {
        contents: [
            {
                role: "user",
                parts: [{ text: fullPrompt }]
            }
        ]
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Gemini API Error (${response.status}):`, errorBody);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `Gemini API request failed: ${response.statusText}`, details: errorBody }),
                headers: { 'Content-Type': 'application/json' }
            };
        }

        const result = await response.json();

        if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            return {
                statusCode: 200,
                body: JSON.stringify({ answer: text }),
                headers: { 'Content-Type': 'application/json' }
            };
        } else {
            console.error('Invalid response structure from Gemini API:', result);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Invalid response structure from Gemini API.' , details: result}),
                headers: { 'Content-Type': 'application/json' }
            };
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An unexpected error occurred while contacting the AI assistant.', details: error.message }),
            headers: { 'Content-Type': 'application/json' }
        };
    }
};
