FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

ENV NODE_ENV=development
ENV VITE_HOST=0.0.0.0

CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0" ]
