## API example: Ruby + Sinatra

This small application demonstrates how you might set up a web server
using Ruby and [Sinatra][sinatra] with RESTful routes to accept your Recurly.js
form submissions and use the tokens to create and update customer billing
information without having to handle credit card data.

This example makes use of the official Recurly [Ruby client library][client]
for API v3.

Note that it is not necessary to use the Sinatra framework. In this example it is
used to organize various API actions into distinct application routes, but one
could just as easily implement these API actions within Rails or any other
application framework.

### Routes

- `POST` [/api/subscriptions/new](app.rb#L37-41)
- `POST` [/api/purchases/new](app.rb#L44-105)
- `POST` [/api/accounts/new](app.rb#L108-120)
- `PUT` [/api/accounts/:account_code](app.rb#L123-136)

### Local Development

1. Start the server

  ```bash
  $ bundle
  $ ruby app.rb
  ```
2. Open [http://localhost:9001](http://localhost:9001)

[sinatra]: http://sinatrarb.com/
[client]: http://github.com/recurly/recurly-client-ruby
