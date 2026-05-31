FROM node:18-alpine

LABEL authors="Erisk Reyes"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000 5000

CMD ["npm", "start"]
