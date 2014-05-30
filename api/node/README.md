## API example: Node + Express

This small application demonstrates how you might set up a web server
using Ruby and [Express][express] with RESTful routes to accept your Recurly.js
form submissions and use the tokens to create and update customer billing
information without having to handle credit card data.

This example makes use of the [node-recurly][node-recurly] module, an
unofficial node client library for Recurly's v2 API.

### Routes

- `POST` [/subscriptions/new](app.js#L18-46)
- `POST` [/accounts/new](app.js#L49-59)
- `PUT` [/accounts/:account_code](app.js#L62-72)

### Use

```bash
$ npm i
$ node app.js
```

[express]: http://expressjs.com/
[node-recurly]: https://github.com/robrighter/node-recurly
