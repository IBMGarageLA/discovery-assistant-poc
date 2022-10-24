FROM node:14-alpine

WORKDIR /app

COPY package.json /app

RUN npm install --only=prod

COPY . /app

ENV NODE_ENV production
ENV PORT 8080

RUN npm run build

EXPOSE 8080


CMD ["npm", "run", "server"]