
# Require sinatra and the recurly gem
require 'sinatra'
require 'recurly'

# Used to create unique account_codes
require 'securerandom'

# Configure the Recurly gem with your subdomain and API key
Recurly.subdomain = 'RECURLY_SUBDOMAIN'
Recurly.api_key = 'RECURLY_API_KEY'

set :port, 9000
set :public_folder, '../../examples'

# POST route to handle a new subscription form
post '/subscriptions/new' do

  # We'll wrap this in a begin-rescue to catch any API
  # errors that may occur
  begin

    # Create the scubscription using minimal
    # information: plan_code, account_code, and
    # the token we generated on the frontend
    subscription = Recurly::Subscription.create plan_code: :basic,
      account: {
        account_code: SecureRandom.uuid,
        billing_info: { token_id: params['recurly-token'] }
      }

    # The subscription has been created and we can redirect
    # to a confirmation page
    redirect 'SUCCESS_URL'
  rescue Recurly::Resource::Invalid, Recurly::API::ResponseError => e

    # Here we may wish to log the API error and send the
    # customer to an appropriate URL, perhaps including
    # and error message
    redirect 'ERROR_URL'
  end
end

# POST route to handle a new account form
post '/accounts/new' do
  begin
    Recurly::Account.create! account_code: SecureRandom.uuid,
      billing_info: { token_id: params['recurly-token'] }
    redirect 'SUCCESS_URL'
  rescue Recurly::Resource::Invalid, Recurly::API::ResponseError => e
    redirect 'ERROR_URL'
  end
end

# PUT route to handle an account update form
put '/accounts/:account_code' do
  begin
    account = Recurly::Account.find params[:account_code]
    account.billing_info = { token_id: params['recurly-token'] }
    account.save!
    redirect 'SUCCESS_URL'
  rescue Recurly::Resource::Invalid, Recurly::API::ResponseError => e
    redirect 'ERROR_URL'
  end
end

# All other routes will be treated as static requests
get '*' do
  send_file File.join(settings.public_folder, request.path, 'index.html')
end
