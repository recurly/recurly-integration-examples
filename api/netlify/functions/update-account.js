const recurly = require('recurly');

const client = new recurly.Client(process.env.RECURLY_API_KEY);

exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);
  const account = event.path.split('/')[3];

  try {
    const accountUpdate = {
      billing_info: {
        token_id: body['recurly-token']
      }
    };

    await client.updateAccount(account, accountUpdate);

    return {
        statusCode: 301,
        headers: {
          Location: process.env.SUCCESS_URL
        }
      };
  } catch (err) {
    const { message } = err;

    return {
      statusCode: 301,
      headers: {
        Location: `${process.env.ERROR_URL}?error=${message}`
      }
    };
  }
};
