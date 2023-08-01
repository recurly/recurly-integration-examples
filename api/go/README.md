## API example: Go + Express

This small application demonstrates how you might set up a web server
using Go with RESTful routes to accept your Recurly.js
form submissions and use the tokens to create and update customer billing
information without having to handle credit card data.

This example makes use of the official [Go client library][go-client-library] for API v3.

### Routes

- `POST` [/api/subscriptions/new](main.go#L25-96)
- `POST` [/api/accounts/new](main.go#99-124)
- `PUT` [/api/accounts/:account_code](main.go#127-151)

### Use

#### Docker

1. If you haven't already, [install docker](https://www.docker.com/get-started).

2. Update the values in docker.env at the [root of the repo](https://github.com/recurly/recurly-integration-examples/blob/main/docker.env)

3. Run `docker-compose up --build`

4. Open [http://localhost:9001](http://localhost:9001)

#### Local

1. Start the server

  ```bash
  go run main.go
  ```

2. Open [http://localhost:9001](http://localhost:9001)
