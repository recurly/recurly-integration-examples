# Contributing

### Contributing to this project

This project is structured in a way that makes it quite easy to
expand both frontend and language-specific backends. Each backend example serves
the same set of frontend examples; thus, any new frontend example will work
with any of the backend servers immediately.

If you're uncertain about any of the guidelines or want help making a contribution, we're
glad to assist. Just [create a Pull Request][new-pr] with your proposal and we'll be happy to
jump in and help.

#### Creating new frontend examples

1. Create a new directory to contain your example in the [public folder](public). Keep all of your HTML, CSS, and JS within this directory.
2. Depending on what action you want your form to take, submit it to the relevant endpoint in the [API server specifications](#api-server-specifications).
3. Update [index.html](public/index.html) to link to your new example.
4. Update the [README](README.md) to link to the code directory of your new example.

#### Creating new backend examples

1. Create a new directory in the [api directory](api), named after the language you wish to add.
2. Implement endpoints which adhere to the [API server specifications](#api-server-specifications).
3. Create a concise and illustrative README describing how to start your server and where to navigate to view the examples in a browser.
4. Update the [main README](README.md) and [API README](api/README.md) to link to the code directory of your new example.

### API Server specifications

| Endpoint | Action |
| -------- | ------ |
| POST `/api/subscriptions/new` | New subscriptions |
| POST `/api/accounts/new` | New accounts |
| PUT `/api/accounts/:account_code` | Account updates |

All other GET requests should serve files directly from the [public directory](public).

### External examples

We love contributors! If you have a site that implements Recurly.js
in a novel or cool way, please [create an issue][new-issue] with a link and we'll
link to it in the readme.

[new-issue]: https://github.com/recurly/recurly-js-examples/issues/new
[new-pr]: https://github.com/recurly/recurly-js-examples/pulls/new
