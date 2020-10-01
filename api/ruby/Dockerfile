FROM ruby:2

ENV PORT 9001
ENV PUBLIC_DIR_PATH public

WORKDIR /usr/src/app

COPY ./api/ruby ./api/ruby
COPY ./public ./public

RUN cd api/ruby && bundle install

EXPOSE $PORT

CMD ruby api/ruby/app.rb -p $PORT
