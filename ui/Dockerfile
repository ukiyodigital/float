FROM node:10-alpine AS dev

RUN apk add --update --no-cache ca-certificates nodejs-npm && npm i -g npm@6.5.0

# create app dir and set as workdir
RUN mkdir -p /app
WORKDIR /app


FROM dev AS pre-build

# install npm packages
COPY . /app/
RUN npm install
