const {app, BrowserWindow} = require('electron');
const path = require('path');
const { initDb } = require('./src/main/db');
const setupIpcHandlers = require('./src/main/ipc');

const isDev = !app.isPackaged;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200, // Increased default size
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false // Simplifies communication for now, can be hardened later
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

app.whenReady().then(async () => {
    await initDb();
    setupIpcHandlers();
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed' , () => {
    if (process.platform !== 'darwin') app.quit();
});