## API example: Go + Web.go

This small application demonstrates how you might set up a web server
using Go and [Web.go][web.go] with RESTful routes to accept your Recurly.js
form submissions and use the tokens to create and update customer billing
information without having to handle credit card data.

This example makes use of an unofficial Recurly [Go client library][client]
for API v2.

Note that it is not necessary to use the Web.go framework. In this example it is
used to organize various API actions into distinct application routes, but one
could just as easily implement these API actions within another application
framework or purely in Go.

### Routes

- `POST` [/api/subscriptions/new](app.go#L25-41)
- `POST` [/api/accounts/new](app.go#L43-54)
- `PUT` [/api/accounts/:account_code](app.go#L56-69)

### Use

1. Start the server

  ```bash
  $ go get github.com/hoisie/web
  $ go get github.com/cgerrior/gorecurly
  $ go run app.go
  ```
2. Open [http://localhost:9001/index.html](http://localhost:9001/index.html)

[web.go]: http://webgo.io/index.html
[client]: https://github.com/cgerrior/gorecurly
