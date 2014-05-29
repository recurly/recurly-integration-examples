## API example: Ruby + Sinatra

This small application demonstrates how you might set up a web server
using Ruby and [Sinatra][sinatra] with RESTful routes to accept your Recurly.js
form submissions and use the tokens to create and update customer billing
information without having to handle credit card data.

### Routes

- `POST` [/subscriptions/new](app.rb#L10-35)
- `POST` [/accounts/new](app.rb#L38-46)
- `PUT` [/accounts/:account_code](app.rb#L49-58)

### Use

```bash
$ bundle
$ ruby app.rb
```

[sinatra]: http://sinatrarb.com/
