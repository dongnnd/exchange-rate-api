FROM node:20-alpine

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package.json yarn.lock ./

RUN yarn install --pure-lockfile --ignore-engines

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER node

COPY --chown=node:node . .

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
