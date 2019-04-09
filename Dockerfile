FROM node:10-alpine

WORKDIR /opt/stock-ticker

COPY package*.json ./

RUN npm install

COPY ./src ./src

EXPOSE 3000

CMD [ "npm", "start" ]
