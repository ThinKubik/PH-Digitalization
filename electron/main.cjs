'use strict';

const { app, BrowserWindow, screen, ipcMain } = require('electron');

ipcMain.on('quit-app', () => app.quit());
const path = require('path');

function createWindow() {
  // Scale to fill screen width — the 3:2 design is wider than most displays,
  // so width-constrained zoom fills the screen with only minor bottom clipping.
  const { width, height } = screen.getPrimaryDisplay().size;
  const zoomFactor = width / 2880;

  const win = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the Vite-built index.html
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));

  // Apply zoom after the page has loaded so the UI fits any screen resolution
  win.webContents.on('did-finish-load', () => {
    win.webContents.setZoomFactor(zoomFactor);
    console.log(
      `[Electron] Screen: ${width}x${height} → zoom factor: ${zoomFactor.toFixed(4)}`
    );
    // Open DevTools in dev mode only (not in packaged builds)
    if (!app.isPackaged) {
      win.webContents.openDevTools({ mode: 'detach' });
    }
  });
}

app.whenReady().then(createWindow);

// Quit when all windows are closed (standard behaviour on Windows/Linux)
app.on('window-all-closed', () => {
  app.quit();
});
