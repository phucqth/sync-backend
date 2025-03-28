FROM node:20-slim
# Create app directory
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
# Bundle app source
COPY . .

EXPOSE 4000
CMD [ "npm", "run", "prod" ]