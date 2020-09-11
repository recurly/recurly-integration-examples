# Require sinatra and the recurly gem
require 'sinatra'
require 'json'
require 'recurly'

# Used to parse URIs
require 'uri'
# Used to create unique account_codes
require 'securerandom'
# Used to load environment variables
require 'dotenv'

Dotenv.load

# Configure the Recurly gem with your subdomain and API key
Recurly.subdomain = ENV['RECURLY_SUBDOMAIN']
Recurly.api_key = ENV['RECURLY_PRIVATE_KEY']

set :port, ENV['PORT']
set :public_folder, ENV['PUBLIC_PATH'] || 'public'

enable :static
enable :logging

success_url = ENV['SUCCESS_URL']
error_url = ENV['ERROR_URL']

# POST route to handle a new subscription form
post '/api/subscriptions/new' do
  # We'll wrap this in a begin-rescue to catch any API
  # errors that may occur
  begin
    # This is not a good idea in production but helpful for debugging
    # These params may contain sensitive information you don't want logged
    logger.info params

    recurly_token_id = params['recurly-token']
    recurly_account_code = params['recurly-account-code'] || SecureRandom.uuid
    billing_info = { token_id: recurly_token_id }

    # Optionally add a 3D Secure token if one is present. You only need to do this
    # if you are integrating with Recurly's 3D Secure support
    unless params['three-d-secure-token']&.empty?
      billing_info['three_d_secure_action_result_token_id'] = params['three-d-secure-token']
    end

    # Create the subscription using minimal
    # information: plan_code, account_code, and
    # the token we generated on the frontend
    subscription = Recurly::Subscription.create! plan_code: :basic,
      account: {
        account_code: recurly_account_code,
        billing_info: billing_info
      }

    # The subscription has been created and we can redirect
    # to a confirmation page
    redirect success_url

  # Handle a 3D Secure required error by redirecting to an authentication page
  rescue Recurly::Transaction::ThreeDSecureError => e
    redirect "/3d-secure/authenticate.html#token_id=#{recurly_token_id}&action_token_id=#{e.three_d_secure_action_token_id}&account_code=#{recurly_account_code}"
  rescue Recurly::Resource::Invalid, Recurly::API::ResponseError => e
    error e
  end
end

# POST route to handle purchases from our checkout form
post '/api/purchses/new' do
  begin
    logger.info params

    purchase = Recurly::Purchase.new(
      currency: 'USD',
      account: {
        first_name: params['first-name'],
        last_name: params['last-name'],
        account_code: SecureRandom.uuid,
        billing_info: {
          token_id: params['recurly-token']
        }
      },
      subscriptions: params['subscriptions']&.map do |sub_params|
        if !sub_params['plan-code'].empty?
          { plan_code: sub_params['plan-code'] }
        else
          nil
        end
      end.compact,
      adjustments: params['items']&.map do |item_params|
        { item_code: item_params['item-code'] }
      end
    )
    collection = Recurly::Purchase.invoice! purchase
    redirect success_url
  rescue Recurly::Resource::Invalid, Recurly::API::ResponseError => e
    error e
  end
end

# POST route to handle a new account form
post '/api/accounts/new' do
  begin
    Recurly::Account.create! account_code: SecureRandom.uuid,
      billing_info: { token_id: params['recurly-token'] }
    redirect success_url
  rescue Recurly::Resource::Invalid, Recurly::API::ResponseError => e
    error e
  end
end

# PUT route to handle an account update form
post '/api/accounts/:account_code' do
  begin
    account = Recurly::Account.find params[:account_code]
    account.billing_info = { token_id: params['recurly-token'] }
    account.save!
    redirect success_url
  rescue Recurly::Resource::Invalid, Recurly::API::ResponseError => e
    error e
  end
end

# This endpoint provides configuration to recurly.js
get '/config' do
  config = {
    publicKey: ENV['RECURLY_PUBLIC_KEY'],
    items: [].tap do |items|
      Recurly::Item.find_each do |item|
        items.unshift({ code: item[:item_code], name: item[:name] })
      end
    end,
    plans: [].tap do |plans|
      Recurly::Plan.find_each do |plan|
        plans.unshift({ code: plan[:plan_code], name: plan[:name] })
      end
    end
  }
  content_type :js
  "window.recurlyConfig = #{config.to_json}"
end

# All other routes will be treated as static requests
get '*' do
  send_file File.join(settings.public_folder, request.path, 'index.html')
end

# Generic error handling
# Here we log the API error and send the
# customer to the error URL, including an error message
def error e
  logger.error e
  error_uri = URI.parse error_url
  error_query = URI.decode_www_form(String(error_uri.query)) << ['error', e.message]
  error_uri.query = URI.encode_www_form(error_query)
  redirect error_uri.to_s
end
