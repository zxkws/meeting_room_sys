FROM node:23-alpine3.19 AS build-stage

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install pnpm -g

RUN pnpm install

COPY . .

RUN pnpm build

RUN ls -la

FROM node:23-alpine3.19 AS production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install pnpm -g

RUN pnpm install

RUN ls -la

EXPOSE 3000

CMD ["node", "/app/main.js"]
