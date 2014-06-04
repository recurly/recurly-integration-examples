
// Dependencies
var Recurly = require('node-recurly');
var express = require('express');
var bodyParser = require('body-parser')
var uuid = require('node-uuid');

// Set up express
var app = express();
app.use(bodyParser());

// Instantiate a configured recurly client
var recurly = new Recurly({
  SUBDOMAIN: 'RECURLY_SUBDOMAIN',
  API_KEY: 'RECURLY_API_KEY'
});

// POST route to handle a new subscription form
app.post('/subscriptions/new', function (req, res) {

  // Create the scubscription using minimal
  // information: plan_code, currency, account_code, and
  // the token we generated on the frontend
  recurly.subscriptions.create({
    plan_code: 'simpleplan',
    currency: 'USD',
    account: {
      account_code: uuid.v1(),
      billing_info: {
        token_id: req.body['recurly-token']
      }
    }
  }, return function (err, response) {
    // If an API error occurs, parse the error message
    // and redirect to an error page
    if (err) {
      var message = parseErrors(err.data);
      return res.redirect('ERROR_URL?error=' + message);
    }

    // Otherwise, we know that the request has succeeded,
    // and we can redirect to a confirmation page
    res.redirect('SUCCESS_URL');
  });

});

// POST route to handle a new account form
app.post('/accounts/new', function (req, res) {
  recurly.accounts.create({
    account_code: uuid.v1(),
    billing_info: {
      token_id: req.body['recurly-token']
    }
  }, return function (err, response) {
    if (err) return res.redirect('ERROR_URL?error=' + parseErrors(err.data));
    res.redirect('SUCCESS_URL');
  });
});

// PUT route to handle an account update form
app.put('/accounts/:account_code', function (req, res) {
  recurly.accounts.update(req.params.account_code, {
    billing_info: {
      token_id: req.body['recurly-token']
    }
  }, return function (err, response) {
    if (err) return res.redirect('ERROR_URL?error=' + parseErrors(err.data));
    res.redirect('SUCCESS_URL');
  });
});

// Start the server
app.listen(9000, function () {
  console.log('Listening on port 9000');
});

// A set of utility functions for parsing API errors
function parseErrors (data) {
  return data.errors
    ? data.errors.error.map(parseValidationErrors).join(', ')
    : [data.error.symbol, data.error.description].join(': ');
}

function parseValidationErrors (e) {
  return [e.$.field, e._].join(' ');
}
