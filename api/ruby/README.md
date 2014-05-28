## API example: Ruby + Sinatra

This small application demonstrates how you might set up a web server
using Ruby and Sinatra with RESTful routes to accept your Recurly.js
form submissions and use the tokens to create and update customer billing
information without having to handle credit card data.

### Routes

- `POST` [/subscriptions/new](app.rb#L12-38)
- `POST` [/accounts/new](app.rb#L41-49)
- `PUT` [/accounts/:account_code](app.rb#L52-61)

### Use

```bash
$ bundle
$ rackup
```
