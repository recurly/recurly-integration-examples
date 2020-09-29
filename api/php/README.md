## API example: PHP + Slim

This small application demonstrates how you might set up a web server
using PHP and [Slim][slim] with RESTful routes to accept your Recurly.js
form submissions and use the tokens to create and update customer billing
information without having to handle credit card data.

This example makes use of the official Recurly [PHP client library][client]
for API v3.

Note that it is not necessary to use the Slim framework. In this example it is
used to organize various API actions into distinct application routes, but one
could just as easily implement these API actions in separate PHP scripts or
within another application framework altogehter.

### Routes

- `POST` [/api/subscriptions/new](app.php#L23-L98)
- `POST` [/api/accounts/new](app.php#L100-127)
- `PUT` [/api/accounts/:account_code](app.php#L129-156)
- `GET` [/config](app.php#L158-162)

### Use

#### Docker

1. If you haven't already, [install docker](https://www.docker.com/get-started).

2. Update the values in docker.env at the (root of the repo)[https://github.com/recurly/recurly-integration-examples/blob/main/docker.env]

3. Run `docker-compose up --build`

4. Open [http://localhost:9001](http://localhost:9001)

#### Local

1. Install dependencies using [Composer][composer]. These instructions assume a global composer
   executable.

  ```bash
  $ composer install
  ```
2. [Set your environment variables][env].
2. Run PHP's built-in server.

  ```bash
  $ php -S localhost:9001 -t ../../public app.php
  ```

[slim]: https://www.slimframework.com
[client]: https://github.com/recurly/recurly-client-php
[composer]: https://getcomposer.org
[env]: ../../#configuring-the-examples
