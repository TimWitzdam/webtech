FROM node:lts-alpine as base

WORKDIR /app

COPY package.json ./

RUN rm -rf node_modules && npm i

COPY . .

CMD ["npx", "tsx", "./server.ts"]
