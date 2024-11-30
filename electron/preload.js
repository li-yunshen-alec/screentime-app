// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose the electron API to the renderer process
contextBridge.exposeInMainWorld('electron', {
  on: (channel, callback) => ipcRenderer.on(channel, (event, data) => callback(data)),
  send: (channel, data) => ipcRenderer.send(channel, data),
});
