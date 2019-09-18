// API usage Dependencies
const Recurly = require('node-recurly');
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
  ERROR_URL
} = process.env;

// Instantiate a configured recurly client
const recurly = new Recurly({
  SUBDOMAIN: RECURLY_SUBDOMAIN,
  API_KEY: RECURLY_API_KEY,
  API_VERSION: '2.21'
});

// POST route to handle a new subscription form
app.post('/api/subscriptions/new', function (req, res) {

  // Build our billing info hash
  const tokenId = req.body['recurly-token'];
  const accountCode = req.body['recurly-account-code'] || uuid.v1();
  const billingInfo = { token_id: tokenId };

  // Optionally add a 3D Secure token if one is present. You only need to do this
  // if you are integrating with Recurly's 3D Secure support
  if (req.body['three-d-secure-token']) {
    billingInfo.three_d_secure_action_result_token_id = req.body['three-d-secure-token']
  }

  // Create the scubscription using minimal
  // information: plan_code, currency, account_code, and
  // the token we generated on the frontend
  recurly.subscriptions.create({
    plan_code: 'basic',
    currency: 'USD',
    account: {
      account_code: accountCode,
      billing_info: billingInfo
    }
  }, function (err, response) {
    if (err) {
      // Here we handle a 3D Secure required error by redirecting to an authentication page
      if (err.data.errors && err.data.errors.transaction_error) {
        const txnError = err.data.errors.transaction_error;
        if (txnError.error_code === 'three_d_secure_action_required') {
          const actionTokenId = txnError.three_d_secure_action_token_id;
          return res.redirect(`/3d-secure/authenticate.html#token_id=${tokenId}&action_token_id=${actionTokenId}&account_code=${accountCode}`);
        }
      }

      // If any other error occurs, parse the error message
      // and redirect to an error page
      const message = errorMessage(err.data);
      return res.redirect(ERROR_URL + '?error=' + message);
    }

    // Otherwise, we know that the request has succeeded,
    // and we can redirect to a confirmation page
    res.redirect(SUCCESS_URL);
  });

});

// POST route to handle a new account form
app.post('/api/accounts/new', function (req, res) {
  recurly.accounts.create({
    account_code: uuid.v1(),
    billing_info: {
      token_id: req.body['recurly-token']
    }
  }, redirect);
});

// PUT route to handle an account update form
app.put('/api/accounts/:account_code', function (req, res) {
  recurly.accounts.update(req.params.account_code, {
    billing_info: {
      token_id: req.body['recurly-token']
    }
  }, redirect);
});

// This endpoint provides configuration to recurly.js
app.get('/config', function (req, res) {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`window.recurlyConfig = { publicKey: '${RECURLY_PUBLIC_KEY}' }`);
});

// Mounts express.static to render example forms
app.use(express.static(__dirname + '/../../public'));

// Start the server
app.listen(9001, function () {
  console.log('Listening on port 9001');
});

// A set of utility functions for redirecting and parsing API errors
function redirect (err, response) {
  if (err) return res.redirect(`${ERROR_URL}?error=${errorMessage(err.data)}`);
  res.redirect(SUCCESS_URL);
}

// Simple error parsing routine to construct a helpful error message
function errorMessage (data) {
  if (data.errors) {
    return parseValidationErrors(data.errors.error);
  }

  console.log(data);

  if (data.error.symbol) {
    return [data.error.symbol, data.error.description].join(': ');
  }
}

function parseValidationErrors (e) {
  return [e.$.field, e._].join(' ');
}
