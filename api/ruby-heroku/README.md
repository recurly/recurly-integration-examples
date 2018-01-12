## API example: Ruby + Sinatra on Heroku

This small application mirrors the [standard Ruby example][ruby-api] with special considerations
to allow it to run on Heroku easily.

This example makes use of the official Recurly [Ruby client library][client]
for API v2.

Note that it is not necessary to use the Sinatra framework. In this example it is
used to organize various API actions into distinct application routes, but one
could just as easily implement these API actions within Rails or any other
application framework.

### Deploy to Heroku

You may immediately deploy this repository to Heroku to get started. Once you have your own clone,
feel free to delete the other language API examples.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

### Routes

- `POST` [/api/subscriptions/new](app.rb#L10-35)
- `POST` [/api/accounts/new](app.rb#L38-46)
- `PUT` [/api/accounts/:account_code](app.rb#L49-58)

### Local Development

1. Start the server

  ```bash
  $ bundle
  $ ruby app.rb
  ```
2. Open [http://localhost:9001](http://localhost:9001)

[sinatra]: http://sinatrarb.com/
[client]: http://github.com/recurly/recurly-client-ruby
