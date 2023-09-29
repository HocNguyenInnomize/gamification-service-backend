FROM node:lts-alpine

WORKDIR /usr/src/app
COPY [ "*.json", "./"]
RUN npm install --silent && mv node_modules ./
COPY . /usr/src/app
RUN npm run build

ARG DB_HOST
ENV DATABASE_HOST=$DB_HOST
ARG DB_PORT
ENV DATABASE_PORT=$DB_PORT
ARG DB_USER
ENV DATABASE_USERNAME=$DB_USER
ARG DB_PASS
ENV DATABASE_PASSWORD=$DB_PASS
ARG DB_NAME
ENV DATABASE_NAME=$DB_NAME

EXPOSE 8888

CMD ["npm", "run" ,"start"]