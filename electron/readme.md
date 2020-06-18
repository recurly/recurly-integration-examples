## Electron example

This small application demonstrates how you might set up [Electron](https://www.electronjs.org/) with [Recurly.js](https://developers.recurly.com/reference/recurly-js/index.html).

The Electron example app needs a separate backend remote server to send requests to Recurly's API. **We do this so we don't expose our private Recurly API key in the Electron distributable.**

This app also makes use of Electron's [`loadURL`](https://www.electronjs.org/docs/api/browser-window#winloadurlurl-options) [`BrowserWindow`](https://www.electronjs.org/docs/api/browser-window) method to load a static HTML file from our remote server into our Electron app on start. Any of Electron's `BrowserWindow` methods, including [`loadFile`](https://www.electronjs.org/docs/api/browser-window#winloadfilefilepath-options), should be okay to use as well, as long as requests from the Electron app are still being made to an external server that contains the private API key as opposed to making requests directly to the Recurly API from the Electron app itself.

### Use

1. Start any of the other servers in /api/
2. Install the Electron app's dependencies

```
npm install
```

3. Start the Electron app with `npm start` with the environment variable `MY_APP_URL` set to your remote server's URL. By default, this value will be set to 'http://localhost:9001'

```
MY_APP_URL=https://my-app.com npm start
```
