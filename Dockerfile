FROM node:18-alpine as dist

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .
RUN yarn --frozen-lockfile && yarn build && yarn install --production --ignore-scripts --prefer-offlin

FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=dist /usr/src/app/build ./build
COPY --from=dist /usr/src/app/node_modules ./node_modules

CMD ["node", "/usr/src/app/build/src/main.js"]
