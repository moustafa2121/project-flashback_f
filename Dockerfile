FROM node:20.11-alpine

# Install npm
RUN apk --no-cache add npm

WORKDIR /react

COPY . .

# Install dependencies
RUN npm install

# Build the application
RUN npm run build
