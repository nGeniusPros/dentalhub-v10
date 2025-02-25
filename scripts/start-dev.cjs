#!/usr/bin/env node
const { exec } = require('child_process');
const net = require('net');

function checkPort(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', (err) => {
      console.log(`DEBUG: Port ${port} not available. Error: ${err.message}`);
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

async function findFreePort(defaultPort) {
  let port = defaultPort;
  if (await checkPort(port)) {
    return port;
  }
  // If default port busy, choose random port between 3000 and 9000
  while (true) {
    port = Math.floor(Math.random() * (9000 - 3000 + 1)) + 3000;
    if (await checkPort(port)) {
      return port;
    }
  }
}

function waitForServer(port) {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      console.log(`DEBUG: Trying to connect to server on port ${port}...`);
      const client = net.createConnection({ port: port }, () => {
        clearInterval(interval);
        client.end();
        resolve();
      });
      client.on('error', () => {});
    }, 1000);
  });
}

async function main() {
  console.log('DEBUG: Starting dev script');
  const defaultPort = 5173;
  const port = await findFreePort(defaultPort);
  console.log(`Using port: ${port}`);
  console.log(`DEBUG: Executing Vite server command: vite --host --port ${port}`);

  // Start the Vite dev server on the found port
  const devProcess = exec(`npx vite --host --port ${port}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting Vite: ${error}`);
    }
  });

  devProcess.stdout.on('data', (data) => {
    process.stdout.write(data);
  });
  devProcess.stderr.on('data', (data) => {
    process.stderr.write(data);
  });
  devProcess.on('exit', (code) => {
    console.log(`DEBUG: Vite process exited with code ${code}`);
  });

  // Wait for server to be available
  await waitForServer(port);
  console.log(`Server is up on port ${port}. Opening browser...`);

  // Open browser. Use 'start' command on Windows.
  exec(`start http://localhost:${port}`);
}

main();