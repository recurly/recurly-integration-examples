## API example: PHP + Slim

This small application demonstrates how you might set up a web server
using PHP and [Slim][slim] with RESTful routes to accept your Recurly.js
form submissions and use the tokens to create and update customer billing
information without having to handle credit card data.

This example makes use of the official Recurly [PHP client library][client]
for API v2.

### Routes

- `POST` [/api/subscriptions/new](app.php#L11-L47)
- `POST` [/api/accounts/new](app.php#L49-63)
- `PUT` [/api/accounts/:account_code](app.php#L65-81)

### Use

1. Install dependencies

  ```bash
  $ curl -sS https://getcomposer.org/installer | php
  $ php composer.phar install
  ```
2. You'll need to serve the directory with a server like nginx or Apache

[slim]: http://www.slimframework.com/
[client]: http://github.com/recurly/recurly-client-php
