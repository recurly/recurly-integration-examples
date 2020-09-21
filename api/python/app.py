import os

# Import Flask and recurly client library
from flask import Flask
from flask import request
from flask import Response
from flask import redirect
import recurly

# We'll use uuid to generate unique account codes
import uuid

# Configure the recurly client with your subdomain and api key
recurly.SUBDOMAIN = os.environ['RECURLY_SUBDOMAIN']
recurly.API_KEY = os.environ['RECURLY_API_KEY']

# Set your Recurly public key
RECURLY_PUBLIC_KEY = os.environ['RECURLY_PUBLIC_KEY']

SUCCESS_URL = os.environ['SUCCESS_URL']
ERROR_URL = os.environ['ERROR_URL']

PUBLIC_DIR_PATH = os.getenv('PUBLIC_DIR_PATH', '../../public')
app = Flask(__name__, static_folder=PUBLIC_DIR_PATH, static_url_path='')

# GET route to show the list of options
@app.route("/", methods=['GET'])
def index():
  return redirect('index.html')

# POST route to handle a new subscription form
@app.route("/api/subscriptions/new", methods=['POST'])
def new_subscription():

  # We'll wrap this in a try to catch any API
  # errors that may occur
  try:

    recurly_token_id = request.form['recurly-token']
    if 'recurly-account-code' in request.form:
      recurly_account_code = request.form['recurly-account-code']
    else:
      recurly_account_code = uuid.uuid1()

    # Build our billing info object
    billing_info = recurly.BillingInfo(
      token_id = recurly_token_id
    )

    # Optionally add a 3D Secure token if one is present. You only need to do this
    # if you are integrating with Recurly's 3D Secure support
    if 'three-d-secure-token' in request.form:
      billing_info.three_d_secure_action_result_token_id = request.form['three-d-secure-token']

    # Create the scubscription using minimal
    # information: plan_code, account_code, currency and
    # the token we generated on the frontend
    subscription = recurly.Subscription(
      plan_code = 'basic',
      currency = 'USD',
      account = recurly.Account(
        account_code = recurly_account_code,
        billing_info = billing_info
      )
    )

    # The subscription has been created and we can redirect
    # to a confirmation page
    subscription.save()
    return redirect(SUCCESS_URL)
  except recurly.ValidationError as error:

    # Here we handle a 3D Secure required error by redirecting to an authentication page
    if error.transaction_error_code == 'three_d_secure_action_required':
      action_token_id = error.transaction_error.three_d_secure_action_token_id
      return redirect("/3d-secure/authenticate.html#token_id=" + recurly_token_id + "&action_token_id=" + action_token_id + "&account_code=" + str(recurly_account_code))

    # Here we may wish to log the API error and send the
    # customer to an appropriate URL, perhaps including
    # and error message. See the `error_redirect` and
    # `compose_errors` functions below.
    error_redirect(compose_errors(error))

# POST route to handle a new account form
@app.route("/api/accounts/new", methods=['POST'])
def new_account():
  try:
    account = recurly.Account(
      account_code = uuid.uuid1(),
      billing_info = recurly.BillingInfo(
        token_id = request.form['recurly-token']
      )
    )
    account.save()
    return redirect(SUCCESS_URL)
  except recurly.ValidationError as errors:
    error_redirect(compose_errors(errors))

# PUT route to handle an account update form
@app.route("/api/accounts/<account_code>", methods=['PUT'])
def update_account(account_code):
  try:
    account = recurly.Account.get(account_code)
    account.billing_info = recurly.BillingInfo(
      token_id = request.form['recurly-token']
    )
    account.save()
    return redirect(SUCCESS_URL)
  except recurly.NotFoundError as error:
    error_redirect(error.message)
  except recurly.ValidationError as errors:
    error_redirect(compose_errors(errors))


# This endpoint provides configuration to recurly.js
@app.route("/config", methods=['GET'])
def config_js():
  return Response("window.recurlyConfig = { publicKey: '" + RECURLY_PUBLIC_KEY + "' }", mimetype='application/javascript')

# A few utility functions for error handling
def error_redirect(message):
  redirect(ERROR_URL + '?errors=' + message)

def compose_errors(errors):
  ', '.join(e.message for e in errors)
