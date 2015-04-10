## API example: C# + Nancy

This small application demonstrates how you might set up a web server
using C# and [Nancy][nancy] with RESTful routes to accept your Recurly.js
form submissions and use the tokens to create and update customer billing
information without having to handle credit card data.

This example makes use of the official Recurly [C#/.NET client library][client]
for API v2.

Note that it is not necessary to use the Nancy framework. In this example it is
used to organize various API actions into distinct application routes, but one
could just as easily implement these API actions within another application
framework.

### Routes

- `POST` [/api/subscriptions/new](app.cs#L26-55)
- `POST` [/api/accounts/new](app.cs#L58-78)
- `PUT` [/api/accounts/{account_code}](app.cs#L81-98)

### Configuration

Specify your [API Key, site subdomain](https://app.recurly.com/go/developer/api_access), and (optionally) page size setting in your `app.config` file:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  <configSections>
    <section name="recurly" type="Recurly.Configuration.Section,Recurly"/>
  </configSections>

  <recurly
    apiKey="123456789012345678901234567890ab"
    subdomain="company"
	pageSize="50" /> <!-- optional. 50 is the default -->

</configuration>
```

### Use

1. Install dependencies

  ```bash
  $ nuget install recurly-api-client
  $ nuget install Nancy
  $ nuget install Nancy.Hosting.Self
  ```
2. Compile the source into app.exe

3. Start the server

  ```bash
  $ mono app.exe
  ```
2. Open [http://localhost:9001/Content/index.html](http://localhost:9001/Content/index.html)

[nancy]: http://nancyfx.org/
[client]: https://github.com/recurly/recurly-client-net
