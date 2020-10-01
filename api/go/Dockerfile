FROM golang:latest

WORKDIR /usr/src/app

COPY ./api/go ./go

COPY ./public ./public

EXPOSE 9001

CMD cd go && go run main.go
