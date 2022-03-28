FROM node

WORKDIR /app

COPY . /app

# Запускается при сборке образа
RUN npm install

# uninstall the current bcrypt modules
RUN npm uninstall bcrypt
# install the bcrypt modules for the machine
RUN npm install bcrypt
# Переменная окружения
ENV PORT 4000
# Запуск приложения на 4000 порте
EXPOSE $PORT

# Запускается каждый раз при запуске image
CMD ["node", "app.js"]