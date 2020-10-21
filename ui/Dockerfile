FROM node:14.8-alpine AS dev

RUN npm i -g npm@6.14

# create app dir and set as workdir
RUN mkdir -p /app
WORKDIR /app


FROM dev AS pre-build

# install npm packages
COPY ./ /app/
RUN npm ci
RUN npm run build
