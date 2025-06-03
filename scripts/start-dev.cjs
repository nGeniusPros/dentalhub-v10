#!/usr/bin/env node
const { exec, spawn } = require('child_process'); 
const net = require('net');
const path = require('path'); 

function checkPort(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', (err) => {
      resolve(false);
    });
    server.once('listening', () => {
      server.close(() => {
        resolve(true);
      });
    });
    server.listen(port);
  });
}

async function findFreePort(startPort, busyPorts = []) {
  let port = startPort;
  while (true) {
    if (!busyPorts.includes(port) && (await checkPort(port))) {
      return port;
    }
    port++;
    if (port > 65535) { 
        throw new Error("Could not find a free port.");
    }
  }
}

function waitForServer(port, serverName = "Server") {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 30; 
    const interval = setInterval(() => {
      attempts++;
      console.log(`DEBUG: Trying to connect to ${serverName} on port ${port} (attempt ${attempts})...`);
      const client = net.createConnection({ port: port }, () => {
        clearInterval(interval);
        client.end();
        console.log(`DEBUG: ${serverName} is up on port ${port}.`);
        resolve();
      });
      client.on('error', (err) => {
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          console.error(`DEBUG: Failed to connect to ${serverName} on port ${port} after ${maxAttempts} attempts. Error: ${err.message}`);
          reject(new Error(`${serverName} on port ${port} did not start in time.`));
        }
        // Keep trying
      });
    }, 1000);
  });
}


async function main() {
  console.log('DEBUG: Starting dev script');

  const netlifyDefaultProxyPort = 8888; // Preferred port for Netlify Dev proxy
  const netlifyFunctionsPort = 9999; // Port we expect Netlify functions to be on (from netlify.toml)
  const viteDefaultPort = 5173; // Preferred port for Vite

  // 1. Determine a free port for Vite, avoiding Netlify's preferred ports initially
  const vitePort = await findFreePort(viteDefaultPort, [netlifyDefaultProxyPort, netlifyFunctionsPort]);
  console.log(`DEBUG: Vite will attempt to run on port: ${vitePort}`);

  // 2. Determine a free port for Netlify Dev's main proxy, avoiding Vite's port and the functions port
  const actualNetlifyProxyPort = await findFreePort(netlifyDefaultProxyPort, [vitePort, netlifyFunctionsPort]);
  console.log(`DEBUG: Netlify Dev proxy will attempt to run on port: ${actualNetlifyProxyPort}`);

  // 3. Start Netlify Dev.
  // Pass the dynamically found proxy port and Vite's target port.
  // Functions port (netlifyFunctionsPort) should be picked up from netlify.toml by Netlify Dev.
  console.log(`DEBUG: Attempting to start Netlify Dev server (proxy on ${actualNetlifyProxyPort}, functions expected on ${netlifyFunctionsPort} from netlify.toml, Vite target ${vitePort})...`);
  const netlifyArgs = ['netlify', 'dev', `--port=${actualNetlifyProxyPort}`, `--target-port=${vitePort}`];
  console.log(`DEBUG: Spawning Netlify Dev with args: ${netlifyArgs.join(' ')} (functions port ${netlifyFunctionsPort} should be loaded from netlify.toml)`);
  const netlifyProcess = spawn('npx', netlifyArgs, { 
    stdio: 'inherit', 
    shell: true 
  });

  netlifyProcess.on('error', (error) => {
    console.error(`ERROR: Failed to start Netlify Dev process: ${error.message}`);
  });

  netlifyProcess.on('exit', (code, signal) => {
    if (code !== 0 && code !== null && signal !== 'SIGINT') { // code can be null if process killed by signal
        console.warn(`WARN: Netlify Dev process exited with code ${code !== null ? code : 'N/A'} and signal ${signal || 'N/A'}`);
    }
  });
  
  // 4. Wait for Netlify Functions server (port configured in netlify.toml, expected to be ${netlifyFunctionsPort}).
  try {
    await waitForServer(netlifyFunctionsPort, "Netlify Functions Server");
    console.log(`DEBUG: Netlify Functions Server confirmed on port ${netlifyFunctionsPort} (as configured in netlify.toml).`);
  } catch (err) {
    console.error(`ERROR: Netlify Functions server did not become available on port ${netlifyFunctionsPort} (expected from netlify.toml). This might affect direct function calls if any are made outside the Netlify Dev proxy.`);
  }

  // 5. Start Vite - Netlify Dev should already be configured to proxy to this targetPort.
  console.log(`DEBUG: Executing Vite server command: npx vite --host --port ${vitePort}`);
  const viteProcess = spawn('npx', ['vite', '--host', '--port', vitePort.toString()], {
    stdio: 'inherit',
    shell: true
  });
  
  viteProcess.on('error', (error) => {
    console.error(`ERROR: Failed to start Vite process: ${error.message}`);
  });

  viteProcess.on('exit', (code, signal) => {
     if (code !== 0 && code !== null && signal !== 'SIGINT') {
        console.warn(`WARN: Vite process exited with code ${code !== null ? code : 'N/A'} and signal ${signal || 'N/A'}`);
     }
  });

  // Graceful shutdown
  function shutdown(signal) {
    console.log(`\nDEBUG: ${signal} received, shutting down servers...`);
    if (viteProcess && !viteProcess.killed) {
      console.log('DEBUG: Terminating Vite process...');
      viteProcess.kill(signal);
    }
    if (netlifyProcess && !netlifyProcess.killed) {
      console.log('DEBUG: Terminating Netlify Dev process...');
      netlifyProcess.kill(signal);
    }
    // Allow time for processes to terminate before exiting main script
    setTimeout(() => process.exit(0), 1000); 
  }

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch(err => {
    console.error("FATAL ERROR in main:", err);
    process.exit(1);
});