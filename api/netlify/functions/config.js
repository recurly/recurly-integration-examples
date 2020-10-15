exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: `window.recurlyConfig = { publicKey: '${process.env.RECURLY_PUBLIC_KEY}' }`,
    headers: {
      'Content-Type': 'application/javascript'
    }
  };
};
