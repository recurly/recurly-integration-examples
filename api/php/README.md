## API example: PHP + Slim

This small application demonstrates how you might set up a web server
using PHP and [Slim][slim] with RESTful routes to accept your Recurly.js
form submissions and use the tokens to create and update customer billing
information without having to handle credit card data.

### Routes

- `POST` [/subscriptions/new](app.php#L11-L47)
- `POST` [/accounts/new](app.php#L49-63)
- `PUT` [/accounts/:account_code](app.php#L65-81)

### Use

```bash
$ curl -sS https://getcomposer.org/installer | php
$ php composer.phar install
```

[slim]: http://www.slimframework.com/
