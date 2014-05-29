<?php

require 'vendor/autoload.php';

// Configure the client with your subdomain and API Key
Recurly_Client::$subdomain = 'subdomain';
Recurly_Client::$apiKey = 'API_KEY';

$app = new \Slim\Slim();

$app->post('/subscriptions/new', function () {

  // We wrap this is a try-catch to handle any errors
  try {

    // Specify the minimum subscription attributes: plan_code
    $subscription = new Recurly_Subscription();
    $subscription->plan_code = 'basic';

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
  if ($error) {
    $app->redirect("ERROR_URL?error=$error");
  } else {
    $app->redirect("SUCCESS_URL");
  }
});

$app->post('/accounts/new', function () {
  try {
    $account = new Recurly_Account(uniqid());
    $account->billing_info = new Recurly_BillingInfo();
    $account->billing_info->token_id = $app->request->params('recurly-token');
    $account->create();
  } catch (Exception $e) {
    $error = $e->getMessage();
  }
  if ($error) {
    $app->redirect("ERROR_URL?error=$error");
  } else {
    $app->redirect("SUCCESS_URL");
  }
});

$app->put('/accounts/:account_code', function ($account_code) {
  try {
    $account = Recurly_Account::get($account_code);
    $account->first_name = $app->request->params('first-name');
    $account->last_name = $app->request->params('last-name');
    $account->billing_info = new Recurly_BillingInfo();
    $account->billing_info->token_id = $app->request->params('recurly-token');
    $account->update();
  } catch (Exception $e) {
    $error = $e->getMessage();
  }
  if ($error) {
    $app->redirect("ERROR_URL?error=$error");
  } else {
    $app->redirect("SUCCESS_URL");
  }
});

$app->run();
