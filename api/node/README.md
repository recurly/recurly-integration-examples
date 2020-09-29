## API example: Node + Express

This small application demonstrates how you might set up a web server
using Node.js and [Express][express] with RESTful routes to accept your Recurly.js
form submissions and use the tokens to create and update customer billing
information without having to handle credit card data.

This example makes use of the official [node client library][node-client-library] for API v3.

Note that it is not necessary to use the Express framework. In this example it is
used to organize various API actions into distinct application routes, but one
could just as easily implement these API actions within another application
framework.

### Routes

- `POST` [/api/subscriptions/new](app.js#L28-66)
- `POST` [/api/accounts/new](app.js#L69-85)
- `PUT` [/api/accounts/:account_code](app.js#L88-103)

### Use

#### Docker

1. If you haven't already, [install docker](https://www.docker.com/get-started).

2. Update the values in docker.env at the (root of the repo)[https://github.com/recurly/recurly-integration-examples/blob/main/docker.env]

3. Run `docker-compose up --build`

4. Open [http://localhost:9001](http://localhost:9001)

#### Local

1. Start the server

  ```bash
  $ npm i
  $ node app
  ```
2. Open [http://localhost:9001](http://localhost:9001)

[express]: https://expressjs.com/
[client]: https://github.com/recurly/recurly-client-node
