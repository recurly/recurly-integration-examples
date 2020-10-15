const recurly = require('recurly');
const uuid = require('node-uuid');
const querystring = require('querystring');

const client = new recurly.Client(process.env.RECURLY_API_KEY);

exports.handler = async (event, context) => {
  const body = querystring.parse(event.body);

  // Build our billing info hash
  const tokenId = body['recurly-token'];
  const code = body['recurly-account-code'] || uuid.v1();
  const billingInfo = { token_id: tokenId };

  // Optionally add a 3D Secure token if one is present. You only need to do this
  // if you are integrating with Recurly's 3D Secure support
  if (body['three-d-secure-token']) {
    billingInfo.three_d_secure_action_result_token_id = body['three-d-secure-token'];
  }

  // Create the purchase using minimal
  // information: planCode, currency, account.code, and
  // the token we generated on the frontend
  const purchaseReq = {
    subscriptions: [{ planCode: 'basic' }],
    currency: 'USD',
    account: { code, billingInfo }
  };

  try {
    await client.createPurchase(purchaseReq);

    return {
      statusCode: 301,
      headers: {
        Location: process.env.SUCCESS_URL
      }
    };
  } catch (err) {
    // Here we handle a 3D Secure required error by redirecting to an authentication page
    if (err && err.transactionError && err.transactionError.code === 'three_d_secure_action_required') {
      const { threeDSecureActionTokenId } = err.transactionError;
      const url = `/3d-secure/authenticate.html#token_id=${tokenId}&action_token_id=${threeDSecureActionTokenId}&account_code=${code}`;

      return {
        statusCode: 301,
        headers: {
          Location: url
        }
      };
    }

    // If any other error occurs, redirect to an error page with the error as a query param
    const { message } = err;

    return {
      statusCode: 301,
      headers: {
        Location: `${process.env.ERROR_URL}?error=${message}`
      }
    };
  }
};
