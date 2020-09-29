FROM ruby:2

WORKDIR /usr/src/app

COPY ./api/ruby ./ruby

RUN cd ruby && bundle install

COPY ./public ./public

EXPOSE 9001

CMD ruby ruby/app.rb
