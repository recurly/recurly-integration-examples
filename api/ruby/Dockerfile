FROM ruby:2

WORKDIR /usr/src/app

COPY ./api/ruby .

RUN bundle install

COPY ./public ./public

EXPOSE 9001

CMD ruby app.rb
