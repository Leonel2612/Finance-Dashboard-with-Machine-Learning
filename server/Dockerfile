FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

EXPOSE 1337

CMD ["node", "index.js"]