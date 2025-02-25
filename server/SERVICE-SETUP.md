# Setting Up DentalHub Twilio Server as a Windows Service

This guide explains how to set up the DentalHub Twilio integration server as a Windows service, allowing it to start automatically with the system and run in the background.

## Option 1: Using NSSM (Recommended)

NSSM (Non-Sucking Service Manager) is a tool that makes it easy to install any program as a Windows service.

### Step 1: Install NSSM

1. Download NSSM from [nssm.cc](https://nssm.cc/download)
2. Extract the zip file
3. Use the appropriate version (32-bit or 64-bit) for your system

### Step 2: Install the Service

1. Open Command Prompt as Administrator
2. Navigate to the NSSM directory
3. Run the following command (adjust paths as needed):

```cmd
nssm.exe install DentalHubTwilioServer
```

4. In the NSSM GUI that appears:
   - **Path**: Browse to your Node.js executable (e.g., `C:\Program Files\nodejs\node.exe`)
   - **Startup Directory**: Enter the full path to the server directory (e.g., `C:\Projects\Dental Hub\dentalhub-v10\server`)
   - **Arguments**: `src/index.js`
   - **Service Name**: `DentalHubTwilioServer` (or your preferred name)

5. Switch to the "Environment" tab and add:
   ```
   NODE_ENV=production
   ```

6. Click "Install Service"

### Step 3: Start the Service

1. Open Services (Run `services.msc`)
2. Find your service (DentalHubTwilioServer)
3. Right-click and select "Start"
4. Set the startup type to "Automatic" if you want it to start with Windows

## Option 2: Using Windows Task Scheduler

If you don't want to install NSSM, you can use Windows Task Scheduler as an alternative.

### Step 1: Create a Scheduled Task

1. Open Task Scheduler (search for it in the Start menu)
2. Click "Create Basic Task"
3. Name the task "DentalHubTwilioServer" and add a description
4. Set the trigger to "When the computer starts"
5. For the action, select "Start a program"
6. Browse to the `start-server.bat` file in your server directory
7. Set "Start in" to your server directory (e.g., `C:\Projects\Dental Hub\dentalhub-v10\server`)
8. Complete the wizard

### Step 2: Modify Task Properties

1. Find your task in the Task Scheduler Library
2. Right-click and select "Properties"
3. On the "General" tab, check "Run whether user is logged on or not"
4. On the "Settings" tab, uncheck "Stop the task if it runs longer than"
5. Click "OK" to save changes

## Viewing Logs

When running as a service, console output isn't visible. You should set up proper logging:

1. Consider installing a logging package like Winston or Bunyan
2. Configure the server to write logs to a file
3. Check these log files if you need to troubleshoot the service

## Troubleshooting

- If the service fails to start, check the Windows Event Viewer for error messages
- Verify that all environment variables are correctly set
- Make sure the Node.js path is correct in your service configuration
- Check that the server directory path is correct
- Ensure the service account has necessary permissions to run the server

## Stopping or Removing the Service

### For NSSM:
```cmd
nssm.exe stop DentalHubTwilioServer
nssm.exe remove DentalHubTwilioServer
```

### For Task Scheduler:
1. Open Task Scheduler
2. Find and right-click your task
3. Select "Disable" to stop or "Delete" to remove