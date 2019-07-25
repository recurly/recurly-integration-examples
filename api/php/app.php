<?php
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

// This halts execution if a static file is found, allowing it to render instead
if (PHP_SAPI == 'cli-server') {
  $url  = parse_url($_SERVER['REQUEST_URI']);
  $file = __DIR__ . "/../../public/$url[path]";
  if (is_file($file)) return false;
}

require 'vendor/autoload.php';

// Configure the client with your subdomain and API Key. We're using ENV vars here,
// but you may wish to store them elsewhere
Recurly_Client::$subdomain = $_ENV['RECURLY_SUBDOMAIN'];
Recurly_Client::$apiKey = $_ENV['RECURLY_API_KEY'];

$app = new \Slim\App;

// Create a new account, subscription, and billing information
$app->post('/api/subscriptions/new', function (Request $request, Response $response, array $args) {
  // We wrap this is a try-catch to handle any errors
  try {

    $tokenId = $request->getParam('recurly-token');

    // Specify the minimum subscription attributes: plan_code, account, and currency
    $subscription = new Recurly_Subscription();
    $subscription->plan_code = 'basic';
    $subscription->currency = 'USD';

    // Create an account with a uniqid and the customer's first and last name
    $subscription->account = new Recurly_Account(uniqid());
    $subscription->account->first_name = $request->getParam('first-name');
    $subscription->account->last_name = $request->getParam('last-name');

    // Now we create a bare BillingInfo with a token
    $subscription->account->billing_info = new Recurly_BillingInfo();
    $subscription->account->billing_info->token_id = $tokenId;

    // Optionally add a 3D Secure token if one is present
    if ($request->getParam('three-d-secure-token')) {
      $subscription->account->billing_info->three_d_secure_action_result_token_id = $request->getParam('three-d-secure-token');
    }

    // Create the subscription
    $subscription->create();

  } catch (Exception $e) {

    // Here we handle a 3D Secure required error by redirecting to an authentication page
    if ($e->errors[0] && $e->errors[0]->error_code == 'three_d_secure_action_required') {
      $actionTokenId = $e->errors[0]->three_d_secure_action_token_id;
      return $response->withRedirect("/3d-secure/authenticate.html#token_id=$tokenId&action_token_id=$actionTokenId");
    }

    // Assign the error message and use it to handle any customer messages or logging
    $error = $e->getMessage();
  }

  // Now we may wish to redirect to a confirmation
  // or back to the form to fix errors.
  if (isset($error)) {
    return $response->withRedirect("$_ENV[ERROR_URL]?error=$error");
  } else {
    return $response->withRedirect("$_ENV[SUCCESS_URL]");
  }
});

// Create a new account and billing information
$app->post('/api/accounts/new', function (Request $request, Response $response, array $args) {
  try {
    $account = new Recurly_Account(uniqid());
    $account->billing_info = new Recurly_BillingInfo();
    $account->billing_info->token_id = $request->getParam('recurly-token');
    $account->create();
  } catch (Exception $e) {
    $error = $e->getMessage();
  }
  if ($error) {
    return $response->withRedirect("$_ENV[ERROR_URL]?error=$error");
  } else {
    return $response->withRedirect("$_ENV[SUCCESS_URL]");
  }
});

$app->put('/api/accounts/{account_code}', function (Request $request, Response $response, array $args) {
  try {
    $account = Recurly_Account::get($args['account_code']);
    $account->first_name = $request->getParam('first-name');
    $account->last_name = $request->getParam('last-name');
    $account->billing_info = new Recurly_BillingInfo();
    $account->billing_info->token_id = $request->getParam('recurly-token');
    $account->update();
  } catch (Exception $e) {
    $error = $e->getMessage();
  }
  if ($error) {
    return $response->withRedirect("$_ENV[ERROR_URL]?error=$error");
  } else {
    return $response->withRedirect("$_ENV[SUCCESS_URLs]");
  }
});

// This endpoint provides configuration to recurly.js
$app->get('/config', function (Request $request, Response $response, array $args) {
  $response->getBody()->write("window.recurlyConfig = { publicKey: '$_ENV[RECURLY_PUBLIC_KEY]' }");
  return $response;
});

$app->run();
