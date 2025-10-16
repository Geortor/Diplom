# pull official base image
FROM node:20.3-alpine3.17 as builder

# set work directory
WORKDIR /usr/src/app

# install dependencies and avoid `node-gyp rebuild` errors
COPY package.json .
RUN npm install

ADD . .

RUN npm install -g serve


