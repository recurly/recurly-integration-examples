## Electron example

This small application demonstrates how you might set up [Electron](https://www.electronjs.org/) with [Recurly.js](https://developers.recurly.com/reference/recurly-js/index.html).

The Electron example app needs a separate backend remote server to send requests to Recurly's API. **We do this so we don't expose our private Recurly API key in the Electron distributable.**

This app starts by instantiating a local express server. The express server has two purposes:

1. Serve a static directory of HTML files for the Electron app to render.
2. Proxy requests to the remote server.

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
