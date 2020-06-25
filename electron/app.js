const { app, BrowserWindow } = require('electron');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { MY_APP_URL = 'http://localhost:9001', PORT = 3005 } = process.env;

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  });

  win.loadURL(`http://localhost:${PORT}/index.html`);
}

function startServer () {
  const app = express();

  app.use(express.static('../public'));
  app.use('*', createProxyMiddleware({ target: MY_APP_URL, changeOrigin: true }));
  app.listen(PORT);
}

app.whenReady().then(startServer).then(createWindow);
