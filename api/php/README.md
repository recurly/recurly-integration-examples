## API example: PHP + Slim

This small application demonstrates how you might set up a web server
using PHP and [Slim][slim] with RESTful routes to accept your Recurly.js
form submissions and use the tokens to create and update customer billing
information without having to handle credit card data.

This example makes use of the official Recurly [PHP client library][client]
for API v2.

Note that it is not necessary to use the Slim framework. In this example it is
used to organize various API actions into distinct application routes, but one
could just as easily implement these API actions in separate PHP scripts or
within another application framework altogehter.

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

The nginx configuration file should contain this code (along with other settings you may need) in your location block:

```
location /api/ {
        root /var/www/recurly-js-examples/api/php/;
        index app.php;
        try_files /app.php $uri $uri/;
		# NOTE: You should have "cgi.fix_pathinfo = 0;" in php.ini
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        # With php5-fpm:
        fastcgi_pass unix:/var/run/php5-fpm.sock;
        fastcgi_index app.php;
        fastcgi_param $SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
}
```

[slim]: http://www.slimframework.com/
[client]: http://github.com/recurly/recurly-client-php
