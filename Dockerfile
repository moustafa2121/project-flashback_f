FROM node:20.11-alpine
WORKDIR /react
COPY . .
RUN npm run build