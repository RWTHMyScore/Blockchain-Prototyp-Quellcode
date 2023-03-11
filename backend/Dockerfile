FROM node:16

RUN apt-get update && apt-get install sqlite3 --assume-yes && npm install -g pnpm

WORKDIR /usr/src/app

COPY ./pnpm-lock.yaml ./

RUN pnpm fetch

COPY . .

RUN pnpm install -r --offline

WORKDIR /usr/src/app

EXPOSE 3000

CMD node ./database/init.js && pnpm startSelfSigned