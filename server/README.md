# Dental Hub Communication Server

This server handles the integration with Twilio for SMS and voice calling, and Retell AI for AI voice agent functionality.

## Setup Instructions

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- A Twilio account with:
  - Account SID
  - Auth Token
  - Twilio phone number
- A Retell AI account with:
  - API Key
  - Agent ID

### Installation

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Create a `.env` file in the server directory by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Fill in your environment variables in the `.env` file:
   ```
   PORT=3001
   
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   
   RETELL_API_KEY=your_retell_api_key
   RETELL_AGENT_ID=your_retell_agent_id
   
   FRONTEND_URL=http://localhost:5173
   ```

### Running the Server

Start the server in development mode:
```bash
npm run dev
```

Or start the server in production mode:
```bash
npm start
```

### Development with Frontend

For a complete development setup, we've included scripts that start both the frontend and backend servers and automatically open a browser:

- `start-with-frontend.bat` - Windows batch file for starting both servers with browser
- `start-with-frontend.ps1` - PowerShell script for Windows
- `start-with-frontend.sh` - Shell script for Linux/macOS

Running these scripts will:
1. Start the backend server on port 3001
2. Start the frontend server on port 5173
3. Open your default browser to http://localhost:5173
4. Display URLs for both servers in the console

### Running as a Service

For production deployments, you may want to run the server as a background service that starts automatically with the system.

We've included several scripts to help set up the server as a service:

- `start-server.bat` - Windows batch file for running the server
- `start-server.ps1` - PowerShell script for Windows
- `start-server.sh` - Shell script for Linux/macOS
- `dentalhub-twilio.service` - Systemd service file for Linux

For detailed instructions on setting up the server as a Windows service, see the [SERVICE-SETUP.md](./SERVICE-SETUP.md) file.

### Troubleshooting Twilio Integration

If you encounter the error "username is required" when starting the server, it typically indicates that the Twilio credentials are not being loaded correctly. Check the following:

1. Ensure your `.env` file exists in the server directory with the correct Twilio credentials
2. Verify that the variable names match exactly: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER`
3. Make sure your Twilio Account SID starts with "AC"
4. Restart the server after making any changes to the `.env` file

You can test your Twilio configuration by visiting:
```
http://localhost:3001/api/twilio/test
```

## API Endpoints

### Twilio SMS Endpoints

- `POST /api/twilio/sms/send` - Send an SMS message
  ```json
  {
    "to": "+1234567890",
    "body": "Your message here",
    "mediaUrl": "https://example.com/image.jpg" // Optional
  }
  ```

- `POST /api/twilio/sms/batch` - Send batch SMS messages
  ```json
  {
    "recipients": ["+1234567890", "+0987654321"],
    "body": "Your message here",
    "mediaUrl": "https://example.com/image.jpg" // Optional
  }
  ```

- `POST /api/twilio/sms/incoming` - Webhook for incoming SMS (configure in Twilio dashboard)

### Twilio Voice Endpoints

- `POST /api/twilio/voice/call` - Initiate an outbound call
  ```json
  {
    "to": "+1234567890",
    "from": "+0987654321" // Optional, defaults to your Twilio number
  }
  ```

- `POST /api/twilio/voice/incoming` - Webhook for incoming calls (configure in Twilio dashboard)

### Retell AI Endpoints

- `POST /api/retell/call` - Initiate an AI voice agent call
  ```json
  {
    "phoneNumber": "+1234567890",
    "callerId": "+0987654321", // Optional, defaults to your Twilio number
    "patientInfo": {
      "name": "John Doe",
      "id": "12345"
    },
    "appointmentContext": {
      "date": "2023-03-15",
      "time": "14:00",
      "provider": "Dr. Smith"
    }
  }
  ```

- `GET /api/retell/agent/status` - Get the status of your Retell AI agent

- `PUT /api/retell/agent/config` - Update the Retell AI agent configuration
  ```json
  {
    "voiceId": "alloy",
    "parameters": {
      "customSchedule": true,
      "schedule": {
        "monday": { "start": "17:00", "end": "09:00" }
      }
    }
  }
  ```

## Configuring Twilio Webhooks

To receive incoming calls and SMS messages, you'll need to configure your Twilio phone number with the following webhooks:

1. For Voice: `https://your-server-url.com/api/twilio/voice/incoming`
2. For SMS: `https://your-server-url.com/api/twilio/sms/incoming`

For local development, you can use a tool like ngrok to expose your local server to the internet.

## Configuring Retell AI Webhooks

Configure your Retell AI agent to send webhooks to:
`https://your-server-url.com/api/retell/webhook`