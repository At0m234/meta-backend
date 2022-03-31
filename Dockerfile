FROM node:17

WORKDIR /app
# Copy all in app folder
COPY . /app
# Запускается при сборке образа
RUN npm install
# uninstall the current bcrypt modules
RUN npm uninstall bcrypt
# install the bcrypt modules for the machine
RUN npm install bcrypt
# Запуск приложения на 4000 порте
EXPOSE 4000
# Запускается каждый раз при запуске image
CMD ["node", "app.js"]