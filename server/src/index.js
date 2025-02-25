const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const twilioRoutes = require('./routes/twilio');
const retellRoutes = require('./routes/retell');

// Load environment variables with explicit path
const envPath = path.resolve(__dirname, '..', '.env');
console.log('Loading environment variables from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('Environment variables loaded successfully');
  console.log('TWILIO_ACCOUNT_SID present:', !!process.env.TWILIO_ACCOUNT_SID);
  console.log('TWILIO_AUTH_TOKEN present:', !!process.env.TWILIO_AUTH_TOKEN);
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Parse incoming form-encoded webhook bodies (Twilio sends POST data in URL-encoded format)
app.use(express.urlencoded({ extended: false }));
// Parse JSON request bodies
app.use(express.json());

// Routes
app.use('/api/twilio', twilioRoutes);
app.use('/api/retell', retellRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('DentalHub Twilio and Retell AI Integration Server');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: {
      message: 'An internal server error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});