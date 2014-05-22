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

    // Specify the minimum subscription attributes: plan_code and currency
    $subscription = new Recurly_Subscription();
    $subscription->plan_code = 'basic';
    $subscription->currency = 'USD';

    // Create an account with a uniqid and the customer's first and last name
    $subscription->account = new Recurly_Account(uniqid());
    $subscription->account->first_name = $_POST['first-name'];
    $subscription->account->last_name = $_POST['last-name'];

    // Now we create a bare BillingInfo
    $subscription->account->billing_info = new Recurly_BillingInfo();
    $subscription->account->billing_info->token_id = $_POST['recurly-token'];

    // Create the subscription
    $subscription->create();

  } catch (Exception $e) {

    // Assign the error message and use it to handle any customer
    // messages or logging
    $error = $e->getMessage();

  }

  // Now we may wish to redirect to a confirmation
  // or back to the form to fix errors.

}
