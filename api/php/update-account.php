<?php

// Require the Recurly PHP client library
require_once('recurly-client-php/lib/recurly.php');

// Configure the client with your subdomain and API Key
Recurly_Client::$subdomain = 'subdomain';
Recurly_Client::$apiKey = 'API_KEY';

// A form has been submitted, so let's create the subscription
if (!empty($_POST)) {

  // We wrap this is a try-catch to handle any errors
  try {

    // Look up the account based on its account code
    $account = Recurly_Account::get($_POST['account-code']);

    // Update any account attiributes we wish. In this case,
    // first_name and last_name
    $account->first_name = $_POST['first-name'];
    $account->last_name = $_POST['last-name'];

    // Since we have a token with all new billing information,
    // we create a new Recurly_BillingInfo and assign it the token
    $account->billing_info = new Recurly_BillingInfo();
    $account->billing_info->token_id = $_POST['recurly-token'];

    // Update the account
    $account->update();

  } catch (Exception $e) {

    // Assign the error message and use it to handle any customer
    // messages or logging
    $error = $e->getMessage();

  }

  // Now we may wish to redirect to a confirmation
  // or back to the form to fix errors.
  if ($error) {
    Header("Location: ERROR_URL?error=$error");
  } else {
    Header("Location: SUCCESS_URL");
  }

}
