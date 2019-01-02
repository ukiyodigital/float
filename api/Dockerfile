FROM node:10-alpine

# create app directory and set the workdir
RUN mkdir -p /app
WORKDIR /app

# install npm packages
COPY ./src/ /app/
RUN npm install
