<?php
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Factory\AppFactory;

// This halts execution if a static file is found, allowing it to render instead
if (PHP_SAPI == 'cli-server') {
  $url  = parse_url($_SERVER['REQUEST_URI']);
  $path = $url['path'] == '/' ? 'index.html' : $url['path'];
  $file = __DIR__ . "/../../public/$path";
  if (is_file($file)) return false;
}

require 'vendor/autoload.php';

// Configure the client with your API Key. We're using ENV vars here,
// but you may wish to store them elsewhere
$recurly_client = new \Recurly\Client($_ENV['RECURLY_API_KEY']);

$app = AppFactory::create();

// Create a new account, subscription, and billing information
// For this we will use the Recurly Create Purchase endpoint
// See: https://developers.recurly.com/api/latest/index.html#operation/create_purchase
$app->post('/api/subscriptions/new', function (Request $request, Response $response, array $args) {

  global $recurly_client;

  // Retrieve the parsed body from the request as params
  $params = (array)$request->getParsedBody();

  // Retrieve the token created by Recurly.js and submitted in our form
  $token_id = $params['recurly-token'];

  // If our form specifies an account code, we can use that; otherwise,
  // create an account code with a uniqid
  $account_code = $params['recurly-account-code'];
  if (is_null($account_code)) {
    $account_code = uniqid();
  }

  // Specify the minimum purchase attributes for a subscription: plan_code, account, and currency
  $purchase_create = [
    'currency' => 'USD',
    'account' => [
      'code' => $account_code,
      'first_name' => $params['first-name'],
      'last_name' => $params['last-name'],
      'billing_info' => [
        'token_id' => $token_id
      ],
    ],
    'subscriptions' => [
      [
        'plan_code' => 'basic'
      ]
    ]
  ];

  // Optionally add a 3D Secure token if one is present
  $three_d_secure_token = $params['three-d-secure-token'];
  if ($three_d_secure_token) {
    $purchase_create['account']['billing_info']['three_d_secure_action_result_token_id'] = $three_d_secure_token;
  }

  // We wrap this is a try-catch to handle any errors
  try {

    // Create the purchase
    $recurly_client->createPurchase($purchase_create);

  } catch (\Recurly\Errors\Transaction $e) {

    // Here we handle a 3D Secure required error by redirecting to an authentication page
    $transaction_error = $e->getApiError()->getTransactionError();
    if ($transaction_error && $transaction_error->getCode() == 'three_d_secure_action_required') {
      $action_token_id = $transaction_error->getThreeDSecureActionTokenId();
      $location = "/3d-secure/authenticate.html#token_id=$token_id&action_token_id=$action_token_id&account_code=$account_code";
      return $response->withHeader('Location', $location)->withStatus(302);
    }

    // Assign the error message and use it to handle any customer messages or logging
    $error = $e->getMessage();

  } catch (\Recurly\Errors\Validation $e) {

    // If the request was not valid, you may want to tell your user why.
    $error = $e->getMessage();

  }

  // Now we may wish to redirect to a confirmation or back to the form to fix any errors.
  $location = $_ENV['SUCCESS_URL'];
  if (isset($error)) {
    $location = "$_ENV[ERROR_URL]?error=$error";
  }

  return $response->withHeader('Location', $location)->withStatus(302);
});

// Create a new account and billing information
$app->post('/api/accounts/new', function (Request $request, Response $response, array $args) {
  global $recurly_client;

  $params = (array)$request->getParsedBody();

  $account_create = [
    'code' => $account_code,
    'first_name' => $params['first-name'],
    'last_name' => $params['last-name'],
    'billing_info' => [
      'token_id' => $params['recurly-token']
    ]
  ];

  try {
    $recurly_client->createAccount($account_create);
  } catch (\Recurly\Errors\Validation $e) {
    $error = $e->getMessage();
  }

  $location = $_ENV['SUCCESS_URL'];
  if (isset($error)) {
    $location = "$_ENV[ERROR_URL]?error=$error";
  }

  return $response->withHeader('Location', $location)->withStatus(302);
});

$app->put('/api/accounts/{account_code}', function (Request $request, Response $response, array $args) {
  global $recurly_client;

  $params = (array)$request->getParsedBody();

  $account_update = [
    'first_name' => $params['first-name'],
    'last_name' => $params['last-name'],
    'billing_info' => [
      'token_id' => $params['recurly-token']
    ]
  ];

  try {
    $recurly_client->updateAccount("code-$args[account_code]", $account_update);
  } catch (\Recurly\Errors\Validation $e) {
    $error = $e->getMessage();
  }

  $location = $_ENV['SUCCESS_URL'];
  if (isset($error)) {
    $location = "$_ENV[ERROR_URL]?error=$error";
  }

  return $response->withHeader('Location', $location)->withStatus(302);
});

// This endpoint provides configuration to recurly.js
$app->get('/doug', function (Request $request, Response $response, array $args) {
  $response->getBody()->write(phpinfo());
  return $response->withHeader('Content-Type', 'application/javascript');
});

// This endpoint provides configuration to recurly.js
$app->get('/config', function (Request $request, Response $response, array $args) {
  $response->getBody()->write("window.recurlyConfig = { publicKey: '$_ENV[RECURLY_PUBLIC_KEY]' }");
  return $response->withHeader('Content-Type', 'application/javascript');
});

$app->run();
