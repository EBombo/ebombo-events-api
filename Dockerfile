# base image
FROM node:14-alpine

# create folder
RUN mkdir /app

# working directory
WORKDIR /app

# add binaries to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# copy app files and build
COPY . /app

# install dependencies
#--only=production
RUN npm install --force

# define env
ENV NODE_ENV=production

# start app
CMD [ "npm", "start" ]