Recurly.js examples
===================
<p align="center">
  <img src="http://i.imgur.com/hu8hAqs.png" align="center">
</p>

This repository contains a set of example implementations of
[recurly.js][recurly-js] using html, css, and JavaScript, and a set of API usage
examples to demonstrate a few common use-cases for collecting and using
recurly.js tokens.

Please note that these examples are not meant to be set onto a web server and
forgotten. They are intended to act as a suggestion, wherein your custom needs
may fill in any implementaiton gaps.

### Payment form examples
- [Minimal billing information][example-minimal] ([Demo][demo-minimal])
- [Advanced pricing features][example-advanced]
- [PayPal Button][example-paypal]

### API token usage examples

- [Ruby](api/ruby)
- [Node](api/node)
- [Python](api/python)
- [PHP](api/php)

### Running locally

These examples are meant to be run locally, allowing you to easily experiment with
modifications and get running quickly.

Simply clone this repository, read through the simple application code to
familiarize yourself, and follow the startup instructions in one of the [API
token usage examples](api) above.

You'll want to adjust the code to fit your specific redirection and error
handling needs, but the example applications are designed to perform essential
API functions on first boot.

### Contributing

[See CONTRIBUTING file](CONTRIBUTING.md).

[recurly-js]: https://github.com/recurly/recurly-js

[example-minimal]: public/minimal
[example-advanced]: public/advanced-pricing
[example-paypal]: public/paypal

[demo-minimal]: https://kale-krate.herokuapp.com/subscribe-minimal

### License

[MIT][license]
