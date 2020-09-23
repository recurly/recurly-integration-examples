import os

# Import Flask and recurly client library
from flask import Flask
from flask import request
from flask import Response
from flask import redirect
import recurly

# We'll use uuid to generate unique account codes
import uuid

# Configure the recurly client with your api key
client = recurly.Client(os.environ['RECURLY_API_KEY'])

# Set your Recurly public key
RECURLY_PUBLIC_KEY = os.environ['RECURLY_PUBLIC_KEY']

SUCCESS_URL = os.environ['SUCCESS_URL']
ERROR_URL = os.environ['ERROR_URL']

app = Flask(__name__, static_folder='../../public', static_url_path='')

# GET route to show the list of options
@app.route("/", methods=['GET'])
def index():
  return redirect('index.html')

# POST route to handle a new subscription form
@app.route("/api/subscriptions/new", methods=['POST'])
def new_purchase():
  # We'll wrap this in a try to catch any API
  # errors that may occur
  try:
    recurly_token_id = request.form['recurly-token']
    # Access or generate account_code
    if 'recurly-account-code' in request.form:
      recurly_account_code = request.form['recurly-account-code']
    else:
      recurly_account_code = str(uuid.uuid1())
    billing_info = { "token_id": recurly_token_id }

    # Optionally add a 3D Secure token if one is present. You only need to do this
    # if you are integrating with Recurly's 3D Secure support
    if 'three-d-secure-token' in request.form:
      billing_info['three_d_secure_action_result_token_id'] = request.form['three-d-secure-token']

    # Create the subscription using minimal
    # information: plan_code, account_code, currency and
    # the token we generated on the frontend
    # For this we will use the Recurly Create Purchase endpoint
    # See: https://developers.recurly.com/api/latest/index.html#operation/create_purchase
    purchase_create = {
        "currency": "USD",
        "account": {
            "code": recurly_account_code,
            "first_name": request.form['first-name'],
            "last_name": request.form['last-name'],
            "billing_info": billing_info,
        },
        "subscriptions": [{"plan_code": "basic"}],
    }
    invoice_collection = client.create_purchase(purchase_create)

    # The purchase has been created and we can redirect
    # to a confirmation page

    return redirect(SUCCESS_URL)
  except recurly.errors.TransactionError as error:
    transaction_error = error.error.get_response().body['transaction_error']
    # Here we handle a 3D Secure required error by redirecting to an authentication page
    if transaction_error['code'] == 'three_d_secure_action_required':
      action_token_id = transaction_error['three_d_secure_action_token_id']
      return redirect("/3d-secure/authenticate.html#token_id=" + recurly_token_id + "&action_token_id=" + action_token_id + "&account_code=" + str(recurly_account_code))
    
    return error_redirect(error.error.message)
    # Here we may wish to log the API error and send the
    # customer to an appropriate URL, perhaps including
    # and error message. See the `error_redirect` 
    # function below.
  except recurly.ApiError as error:
    return error_redirect(error.error.message)

# POST route to handle a new account form
@app.route("/api/accounts/new", methods=['POST'])
def new_account():
  try:
    # Access or generate account_code
    if 'recurly-account-code' in request.form:
      recurly_account_code = request.form['recurly-account-code']
    else:
      recurly_account_code = uuid.uuid1()

    account_create = {
      "code": recurly_account_code,
      "first_name": request.form['first-name'],
      "last_name": request.form['last-name'],
      "billing_info": { "token_id": request.form['recurly-token']}
    }
    account = client.create_account(account_create)
    return redirect(SUCCESS_URL)
  except recurly.ApiError as error:
    return error_redirect(error.error.message)


# PUT route to handle an account update form
@app.route("/api/accounts/<account_code>", methods=['PUT'])
def update_account(account_code):
  try:
    account_update = {
      "billing_info": recurly.BillingInfo(
        token_id = request.form['recurly-token']
      )
    }
    account = client.update_account("code-%s" % account_code,  account_update)
    return redirect(SUCCESS_URL)
  except recurly.ApiError as error:
    return error_redirect(error.error.message)


# This endpoint provides configuration to recurly.js
@app.route("/config", methods=['GET'])
def config_js():
  return Response("window.recurlyConfig = { publicKey: '" + RECURLY_PUBLIC_KEY + "' }", mimetype='application/javascript')

# A few utility functions for error handling
def error_redirect(message):
  return redirect(ERROR_URL + '?errors=' + message)
