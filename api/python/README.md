## API example: Python + Flask

This small application demonstrates how you might set up a web server
using Python and [Flask][flask] with RESTful routes to accept your Recurly.js
form submissions and use the tokens to create and update customer billing
information without having to handle credit card data.

This example makes use of the official Recurly [Python client library][client]
for API v2.

### Routes

- `POST` [/subscriptions/new](app.py#L17-47)
- `POST` [/accounts/new](app.py#L50-62)
- `PUT` [/accounts/:account_code](app.py#L65-77)

### Use

1. Start the server

  ```bash
  $ pip install -r requirements.txt
  $ python app.py
  ```
2. Open [http://localhost:9001](http://localhost:9001)

[flask]: http://flask.pocoo.org/
[client]: http://github.com/recurly/recurly-client-python
