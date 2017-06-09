FROM node:6.11.0-alpine

WORKDIR /registry-server

COPY controller controller
COPY lib lib
COPY middleware middleware
COPY models models
COPY node_modules node_modules
COPY public public
COPY templates templates
COPY test test
COPY csrf.js csrf.js
COPY init-mongo.sh init-mongo.sh
COPY newrelic.js newrelic.js
COPY package.json package.json
COPY Procfile Procfile
COPY server.js server.js
COPY template-helper.js template-helper.js

EXPOSE 3000 5000

CMD ["npm", "start"]