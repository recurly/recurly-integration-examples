const { app, BrowserWindow } = require('electron');

function createWindow () {
  const { MY_APP_URL } = process.env;
  const url = MY_APP_URL || 'http://localhost:9001/';

  const win = new BrowserWindow({
    width: 800,
    height: 600
  });

  win.loadURL(url);
}

app.whenReady().then(createWindow);
