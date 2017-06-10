FROM node:boron

COPY . /registry-server
WORKDIR /registry-server

RUN git submodule update --init --recursive --depth 1
RUN npm install
RUN npm install nodemon

EXPOSE 3000 5000

CMD [ "npm", "start" ]

