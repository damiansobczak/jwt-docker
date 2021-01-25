FROM node:12

RUN npm install -g nodemon
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD ["nodemon"]