FROM node:15

RUN npm install -g nodemon

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./app

ENTRYPOINT ["nodemon", "/app/src/app.js"]

ENV PORT=3000

EXPOSE 3000

CMD ["nodemon"]