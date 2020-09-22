// API usage Dependencies
const recurly = require('recurly')
const express = require('express');
const bodyParser = require('body-parser');

// We'll use uuids to generate account_code values
const uuid = require('node-uuid');

// Set up express
const app = express();
app.use(bodyParser());

// These are the various configuration values used in this example. They are
// pulled from the ENV for ease of use, but can be defined directly or stored
// elsewhere
const {
  RECURLY_SUBDOMAIN,
  RECURLY_API_KEY,
  RECURLY_PUBLIC_KEY,
  SUCCESS_URL,
  ERROR_URL,
  PUBLIC_DIR_PATH
} = process.env;

// Instantiate a configured recurly client
const client = new recurly.Client(RECURLY_API_KEY)

// POST route to handle a new subscription form
app.post('/api/subscriptions/new', async function (req, res) {
  // Build our billing info hash
  const tokenId = req.body['recurly-token'];
  const code = req.body['recurly-account-code'] || uuid.v1();
  const billingInfo = { token_id: tokenId };

  // Optionally add a 3D Secure token if one is present. You only need to do this
  // if you are integrating with Recurly's 3D Secure support
  if (req.body['three-d-secure-token']) {
    billingInfo.three_d_secure_action_result_token_id = req.body['three-d-secure-token']
  }

  // Create the purchase using minimal
  // information: planCode, currency, account.code, and
  // the token we generated on the frontend
  const purchaseReq = {
    subscriptions: [{ planCode: 'basic' }],
    currency: 'USD',
    account: { code, billingInfo }
  }

  try {
    await client.createPurchase(purchaseReq);
    res.redirect(SUCCESS_URL);
  }
  catch (err) {
    // Here we handle a 3D Secure required error by redirecting to an authentication page
    if (err && err.transactionError && err.transactionError.code === 'three_d_secure_action_required') {
      const { threeDSecureActionTokenId } = err.transactionError;
      const url = `/3d-secure/authenticate.html#token_id=${tokenId}&action_token_id=${threeDSecureActionTokenId}&account_code=${code}`

      return res.redirect(url);
    }

    // If any other error occurs, redirect to an error page with the error as a query param
    const { message } = err;
    return res.redirect(`${ERROR_URL}?error=${message}`);
  }
});

// POST route to handle a new account form
app.post('/api/accounts/new', async function (req, res) {
  try {
    const accountCreate = {
      code: uuid.v1(),
      billing_info: {
        token_id: req.body['recurly-token']
      }
    }

    await client.createAccount(accountCreate);
    res.redirect(SUCCESS_URL);
  }
  catch (err) {
    const { message } = err;
    return res.redirect(`${ERROR_URL}?error=${message}`);
  }
});

// PUT route to handle an account update form
app.put('/api/accounts/:account_code', async function (req, res) {
  try {
    const accountUpdate = {
      billing_info: {
        token_id: req.body['recurly-token']
      }
    }

    await client.updateAccount(req.params.account_code, accountUpdate);
    res.redirect(SUCCESS_URL);
  }
  catch (err) {
    const { message } = err;
    return res.redirect(`${ERROR_URL}?error=${message}`);
  }
});

// This endpoint provides configuration to recurly.js
app.get('/config', function (req, res) {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`window.recurlyConfig = { publicKey: '${RECURLY_PUBLIC_KEY}' }`);
});

// Mounts express.static to render example forms
const pubDirPath = PUBLIC_DIR_PATH || '/../../public';

app.use(express.static(__dirname + pubDirPath));

// Start the server
app.listen(9001, function () {
  console.log('Listening on port 9001');
});
