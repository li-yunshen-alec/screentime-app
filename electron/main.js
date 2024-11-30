// main process: main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const WebSocket = require('ws');
const path = require('path');

let mainWindow;
let siteUsageData = {}; // Store site usage data

// Create the main Electron window
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Ensure preload script is set
      nodeIntegration: false, // Disable nodeIntegration for security
      contextIsolation: true, // Enable contextIsolation for security
    },
  });

  mainWindow.loadURL('http://localhost:5173'); // Load the React app

  // Start WebSocket server
  const wss = new WebSocket.Server({ port: 8080 });

  wss.on('connection', (ws) => {
    console.log('Extension connected to desktop app');

    // Send initial data to the extension
    ws.send(JSON.stringify({ type: 'initialData', data: siteUsageData }));

    ws.on('message', (message) => {
      const parsed = JSON.parse(message);

      if (parsed.type === 'updateUsage') {
        siteUsageData = parsed.data;
        console.log('Updated site usage:', siteUsageData);

        // Broadcast updated usage data to the renderer process
        if (mainWindow) {
          mainWindow.webContents.send('updateUsage', siteUsageData); // Ensure it's sent to the correct window
        }
      }
    });

    ws.on('close', () => {
      console.log('Extension disconnected');
    });
  });
});

// Quit the app when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Reopen the app (macOS specific behavior)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
