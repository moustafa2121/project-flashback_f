FROM node:20.11-alpine

# Install npm
RUN apk --no-cache add npm

WORKDIR /react

COPY . .

# Install dependencies
RUN npm set progress=false
RUN npm config set registry http://registry.npmjs.org/
RUN npm install

# Build the application
RUN npm run build
