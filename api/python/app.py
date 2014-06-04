
# Import Flask and recurly client library
from flask import Flask
from flask import request
import recurly

# We'll use uuid to generate unique account codes
import uuid

# Configure the recurly client with your subdomain and api key
recurly.SUBDOMAIN = 'RECURLY_SUBDOMAIN'
recurly.API_KEY = 'RECURLY_API_KEY'

app = Flask(__name__, static_folder='../../examples', static_url_path='')

# POST route to handle a new subscription form
@app.route("/subscriptions/new", methods=['POST'])
def new_subscription():

  # We'll wrap this in a try to catch any API
  # errors that may occur
  try:

    # Create the scubscription using minimal
    # information: plan_code, account_code, and
    # the token we generated on the frontend
    subscription = recurly.Subscription(
      plan_code = 'basic',
      account = recurly.Account(
        account_code = uuid.uuid1(),
        billing_info = recurly.BillingInfo(
          token_id = request.form['recurly-token']
        )
      )
    )

    # The subscription has been created and we can redirect
    # to a confirmation page
    subscription.save
    redirect('SUCCESS_URL')
  except recurly.ValidationError, errors:

    # Here we may wish to log the API error and send the
    # customer to an appropriate URL, perhaps including
    # and error message. See the `error_redirect` and
    # `compose_errors` functions below.
    error_redirect(compose_errors(errors))

# POST route to handle a new account form
@app.route("/accounts/new", methods=['POST'])
def new_account():
  try:
    account = recurly.Account(
      account_code = uuid.uuid1(),
      billing_info = recurly.BillingInfo(
        token_id = request.form['recurly-token']
      )
    )
    account.save
    redirect('SUCCESS_URL')
  except recurly.ValidationError, errors:
    error_redirect(compose_errors(errors))

# PUT route to handle an account update form
@app.route("/accounts/<account_code>", methods=['PUT'])
def update_account(account_code):
  try:
    account = recurly.Account.get(account_code)
    account.billing_info = recurly.BillingInfo(
      token_id = request.form['recurly-token']
    )
    account.save
    redirect('SUCCESS_URL')
  except recurly.NotFoundError, error:
    error_redirect(error.message)
  except recurly.ValidationError, errors:
    error_redirect(compose_errors(errors))

# A few utility functions for error handling
def error_redirect(message):
  redirect('ERROR_URL?errors=' + message)

def compose_errors(errors):
  ', '.join(e.message for e in errors)

if __name__ == "__main__":
  app.run('127.0.0.1', 9001)
