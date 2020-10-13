const recurly = require('recurly');
const uuid = require('node-uuid');

const client = new recurly.Client(process.env.RECURLY_API_KEY);

exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);

  try {
    const accountCreate = {
      code: uuid.v1(),
      billing_info: {
        token_id: body['recurly-token']
      }
    }

    await client.createAccount(accountCreate);

    return {
      statusCode: 301,
      headers: {
        Location: process.env.SUCCESS_URL
      }
    };
  }
  catch (err) {
    const { message } = err;

    return {
      statusCode: 301,
      headers: {
        Location: `${process.env.ERROR_URL}?error=${message}`
      }
    };
  }
}
