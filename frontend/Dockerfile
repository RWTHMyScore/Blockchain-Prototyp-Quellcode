FROM node:16

RUN npm install -g pnpm http-server

WORKDIR /usr/src/app

COPY ./pnpm-lock.yaml ./

RUN pnpm fetch

COPY . .

RUN pnpm install -r --offline

EXPOSE 443

CMD pnpm build && http-server dist --tls true --cert certificates/server.crt --key certificates/server.key -d false -p 443 --cors
