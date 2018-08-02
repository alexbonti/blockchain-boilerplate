FROM node:8.9.1

ENV GOPATH /go
RUN mkdir /portal
WORKDIR /portal

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN  npm i

COPY webpack.config.js webpack.config.js
COPY .babelrc .babelrc
COPY app app
RUN npm run build

COPY . .
