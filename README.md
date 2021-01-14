<a href="https://heroku.com/deploy"><img align="right" height="28" src="https://www.herokucdn.com/deploy/button.png"></a>
<a href="https://deploy.cloud.run"><img align="right" height="28" src="https://deploy.cloud.run/button.svg"></a>
<a href="https://app.netlify.com/start/deploy?repository=https://github.com/recurly/recurly-integration-examples">
  <img align="right" height="28" src="https://www.netlify.com/img/deploy/button.svg">
</a>
Recurly integration examples
===================
<p align="center">
  <img src="https://i.imgur.com/irVHiPO.png" align="center">
</p>

This repository contains a set of example implementations of
[recurly.js][recurly-js] using html, css, and JavaScript, and a set of API usage
examples to demonstrate a few common use-cases for integrating with Recurly.

Please note that these examples are not meant to be set onto a web server and
forgotten. They are intended to act as a suggestion, wherein your custom needs
may fill in any implementaiton gaps.

### Payment form examples

- [Payment form examples][examples]

### API usage examples

- [Ruby](api/ruby)
- [Node](api/node)
- [Python](api/python)
- [PHP](api/php)
- [Java](api/java)
- [C#, ASP.NET Core](api/dotnet)

#### Configuring the examples

Each API example will pull configuration values from environment variables. You may set
them to quickly configure the example to connect to your Recurly site.

| Environment variable | description |
| -------------------- | ----------- |
| RECURLY_SUBDOMAIN | The subdomain of your recurly site |
| RECURLY_API_KEY | Your [private API key][api-keys] |
| RECURLY_PUBLIC_KEY | Your [public API key][api-keys] |
| SUCCESS_URL | A URL to redirect to when an action suceeds |
| ERROR_URL | A URL to redirect to when an error occurs |

### How to run

Each example can be run either locally or through [Docker](https://docs.docker.com/), allowing
you to easily experiment with modifications and get running quickly.

You should adjust the code to fit your specific redirection and error handling needs, but the
example applications are designed to perform essential API functions on first boot.

**Note**: These examples are purely for demonstration purposes and we do not recommend using them
as the foundation of a production system.

#### Docker

Each example includes a Dockerfile and a docker-compose.yml file to allow them to be run through
[Docker](https://docs.docker.com/).

To run any of the examples through Docker, clone this repository, update the
[docker.env file at the root of level of the project](docker.env) with values corresponding to your Recurly site, and run `docker-compose up` inside the directory of any of the examples.

#### Local

To run locally, simply clone this repository, read through the simple application code to
familiarize yourself, and follow the startup instructions in one of the [API
token usage examples](api) above.

#### Deploy Immediately to Cloud Services

This repository can be deployed immediately to Heroku or Google Cloud using the included
[Ruby example](api/ruby). If you choose to do this, feel free to delete the other language
backends from your clone.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

[![Run on Google Cloud](https://deploy.cloud.run/button.svg)](https://deploy.cloud.run)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/recurly/recurly-integration-examples)

### Looking for React?

If you plan to use React on your frontend, check out our [react-recurly][react-recurly-repo] library.
We maintain an example integration of `react-recurly` in the documentation for that library. Be sure
to read through the [documentation][react-recurly-docs] as you explore the [examples][react-recurly-demo].

### Contributing

[See CONTRIBUTING file](CONTRIBUTING.md).

### License

[MIT](license.md)

[recurly-js]: https://github.com/recurly/recurly-js
[examples]: public
[api-keys]: https://app.recurly.com/go/integrations/api_keys
[react-recurly-repo]: https://github.com/recurly/react-recurly
[react-recurly-docs]: https://recurly.github.io/react-recurly
[react-recurly-demo]: https://recurly.github.io/react-recurly/?path=/docs/introduction-interactive-demo--page
