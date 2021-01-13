## API example: C# + ASP.NET Core

This small application demonstrates how you might set up a web server
using C# and [ASP.NET Core][aspnet] with RESTful routes to accept your Recurly.js
form submissions and use the tokens to create and update customer billing
information without having to handle credit card data.

This example makes use of the official Recurly [.NET client library][client]
for API v3.

Note that it is not necessary to use the ASP.NET framework. In this example it is
used to organize various API actions into distinct application routes, but one
could just as easily implement these API actions in application framework altogether.

### Routes

- `POST` [/api/subscriptions/new](Controllers/AppController.cs#L28-L80)
- `POST` [/api/accounts/new](Controllers/AppController.cs#L83-L107)
- `PUT` [/api/accounts/:account_code](Controllers/AppController.cs#L110-L128)
- `GET` [/config](Controllers/AppController.cs#L132-L139)

### Use

#### Docker

1. If you haven't already, [install docker](https://www.docker.com/get-started).

1. Update the values in docker.env at the (root of the repo)[https://github.com/recurly/recurly-integration-examples/blob/main/docker.env]

1. Run `docker-compose up --build`

1. Open [http://localhost:9001](http://localhost:9001)

#### Local

1. Install [.NET Core][dotnet]. These instructions assume the `dotnet` CLI is present and executable.

1. [Set your environment variables][env].

1. Start the [Kestrel][kestrel] server.

  ```bash
  $ dotnet run --project "./api/dotnet"
  ```

[aspnet]: https://docs.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-3.1
[client]: https://github.com/recurly/recurly-client-dotnet
[dotnet]: https://dotnet.microsoft.com/download
[env]: https://github.com/recurly/recurly-integration-examples#configuring-the-examples
[kestrel]: https://docs.microsoft.com/en-us/aspnet/core/fundamentals/servers/kestrel?view=aspnetcore-3.1
