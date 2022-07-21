# base image
FROM node:14-alpine

# Update npm
RUN npm install -g npm@7

# create folder
RUN mkdir /app

# working directory
WORKDIR /app

# Copy app files
COPY package.json package-lock.json ./

# install dependencies
RUN npm install --force

# Copy app files
COPY . .

# set port
ARG SERVER_PORT=5000
ENV SERVER_PORT=$SERVER_PORT
EXPOSE $SERVER_PORT

# Define config
ARG SERVER_CONFIG
ENV SERVER_CONFIG=$SERVER_CONFIG

# define env
ENV NODE_ENV development

# start app
CMD [ "npm", "start" ]
