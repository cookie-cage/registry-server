FROM node:6.11.0-alpine

WORKDIR /registry-server

#  download submodules
COPY .gitmodules .gitmodules
COPY .git .git
RUN apk add --no-cache --virtual .build-deps \
    git \
    && git submodule update --init --recursive --depth 1 \
    && apk del .build-deps

# download dependencies
COPY node_modules node_modules
COPY package.json package.json
RUN npm install

# app files
COPY controller controller
COPY lib lib
COPY middleware middleware
COPY models models
COPY public public
COPY templates templates
COPY test test
COPY views views
COPY csrf.js csrf.js
COPY newrelic.js newrelic.js
COPY Procfile Procfile
COPY server.js server.js
COPY template-helper.js template-helper.js

EXPOSE 3000 5000

CMD ["npm", "start"]
