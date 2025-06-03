// Simple proxy server to forward requests to Netlify functions
// This is a workaround for the Netlify functions server not properly handling requests

import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Setup require for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Load environment variables
dotenv.config();

// Import the revenue function
const revenueHandler = require('./netlify/functions/dashboard/revenue');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Direct handler for revenue endpoint
app.get('/api/dashboard/revenue', async (req, res) => {
  console.log('Received request for /api/dashboard/revenue');
  console.log('Query parameters:', req.query);
  
  try {
    // Create a mock event object
    const mockEvent = {
      httpMethod: 'GET',
      path: '/api/dashboard/revenue',
      queryStringParameters: req.query,
      headers: req.headers
    };
    
    // Create a mock context object
    const mockContext = {};
    
    // Call the handler function directly
    const response = await revenueHandler.handler(mockEvent, mockContext);
    
    // Set the status code
    res.status(response.statusCode);
    
    // Set the headers
    if (response.headers) {
      Object.keys(response.headers).forEach(key => {
        res.setHeader(key, response.headers[key]);
      });
    }
    
    // Send the response body
    if (response.body) {
      res.send(response.body);
    } else {
      res.end();
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: error.message });
  }
});

// Direct handler for nexhealth test endpoint
app.get('/api/nexhealth/test', async (req, res) => {
  console.log('Received request for /api/nexhealth/test');
  
  try {
    // Import the nexhealth test function
    const nexhealthTestHandler = require('./netlify/functions/nexhealth/test');
    
    // Create a mock event object
    const mockEvent = {
      httpMethod: 'GET',
      path: '/api/nexhealth/test',
      queryStringParameters: req.query,
      headers: req.headers
    };
    
    // Create a mock context object
    const mockContext = {};
    
    // Call the handler function directly
    const response = await nexhealthTestHandler.handler(mockEvent, mockContext);
    
    // Set the status code
    res.status(response.statusCode);
    
    // Set the headers
    if (response.headers) {
      Object.keys(response.headers).forEach(key => {
        res.setHeader(key, response.headers[key]);
      });
    }
    
    // Send the response body
    if (response.body) {
      res.send(response.body);
    } else {
      res.end();
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('- GET /api/dashboard/revenue');
  console.log('- GET /api/nexhealth/test');
});
