# Require sinatra and the recurly gem
require 'sinatra'
require 'json'
require 'recurly'

# Used to parse URIs
require 'uri'
# Used to create unique account_codes
require 'securerandom'

set :bind, '0.0.0.0'
set :port, ENV['PORT'] || 9001
set :public_folder, ENV['PUBLIC_DIR_PATH'] || '../../public'

enable :logging

success_url = ENV['SUCCESS_URL']

client = Recurly::Client.new(api_key: ENV['RECURLY_API_KEY'])

# Generic error handling
# Here we log the API error and send the
# customer to the error URL, including an error message
def handle_error e
  logger.error e
  error_uri = URI.parse ENV['ERROR_URL']
  error_query = URI.decode_www_form(String(error_uri.query)) << ['error', e.message]
  error_uri.query = URI.encode_www_form(error_query)
  redirect error_uri.to_s
end

# POST route to handle a new subscription form
post '/api/subscriptions/new' do
  logger.info params
  # DEPRECATED: use /api/purchases/new and specify the subscriptions[][plan-code]
  redirect '/api/purchases/new?subscriptions[][plan-code]=basic', 307
end

# POST route to handle a new purchase form
post '/api/purchases/new' do
  # This is not a good idea in production but helpful for debugging
  # These params may contain sensitive information you don't want logged
  logger.info params

  recurly_account_code = params['recurly-account-code'] || SecureRandom.uuid

  recurly_token_id = params['recurly-token']
  billing_info = { token_id: recurly_token_id }
  # Optionally add a 3D Secure token if one is present. You only need to do this
  # if you are integrating with Recurly's 3D Secure support
  unless params.fetch('three-d-secure-token', '').empty?
    billing_info['three_d_secure_action_result_token_id'] = params['three-d-secure-token']
  end

  purchase_create = {
    currency: "USD",
    # This can be an existing account or a new acocunt
    account: {
      code: recurly_account_code,
      first_name: params['first-name'],
      last_name: params['last-name'],
      billing_info: billing_info
    }
  }

  subscriptions = params['subscriptions']&.map do |sub_params|
    if !sub_params['plan-code'].empty?
      { plan_code: sub_params['plan-code'] }
    else
      nil
    end
  end.compact
  # Add subscriptions to the request if there are any
  purchase_create[:subscriptions] = subscriptions if subscriptions&.any?

  line_items = params['items']&.map do |item_params|
    {
      item_code: item_params['item-code'],
      revenue_schedule_type: 'at_invoice'
    }
  end
  # Add line_items to the request if there are any
  purchase_create[:line_items] = line_items if line_items&.any?

  begin
    purchase = client.create_purchase(body: purchase_create)

    redirect success_url
  rescue Recurly::Errors::TransactionError => e
    txn_error = e.recurly_error.transaction_error
    hash_params = {
      token_id: recurly_token_id,
      action_token_id: txn_error.three_d_secure_action_token_id,
      account_code: recurly_account_code
    }.map { |k, v| "#{k}=#{v}" }.join('&')
    redirect "/3d-secure/authenticate.html##{hash_params}"
  rescue Recurly::Errors::APIError => e
    # Here we may wish to log the API error and send the customer to an appropriate URL, perhaps including an error message
    handle_error e
  end
end

# POST route to handle a new account form
post '/api/accounts/new' do
  begin
    client.create_account(body: {
      code: SecureRandom.uuid,
      billing_info: {
        token_id: params['recurly-token']
      }
    })
    redirect success_url
  rescue Recurly::Errors::APIError => e
    handle_error e
  end
end

# PUT route to handle an account update form
post '/api/accounts/:account_code' do
  begin
    client.update_account(
      account_id: "code-#{params[:account_code]}",
      body: {
        billing_info: {
          token_id: params['recurly-token']
        }
      }
    )
  rescue Recurly::Errors::APIError => e
    handle_error e
  end
end

post '/tax' do
  { rate: 0.05 }.to_json
end

# This endpoint provides configuration to recurly.js
get '/config' do
  items = [].tap do |items|
    client.list_items(params: { limit: 200, state: 'active' }).each do |item|
      items << { code: item.code, name: item.name }
    end
  end
  plans = [].tap do |plans| client.list_plans(params: { limit: 200, state: 'active' }).each do |plan|
      plans << { code: plan.code, name: plan.name }
    end
  end

  config = {
    publicKey: ENV['RECURLY_PUBLIC_KEY'],
    items: items,
    plans: plans
  }

  content_type :js
  "window.recurlyConfig = #{config.to_json}"
end

# All other routes will be treated as static requests
get '*' do
  send_file File.join(settings.public_folder, request.path, 'index.html')
end
