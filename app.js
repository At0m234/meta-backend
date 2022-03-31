require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const {auth} = require('./middlewares/auth');
const usersRoutes = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const CentralizedErrorHandler = require('./middlewares/centralized-error-handler');

const PORT = 4000;

const app = express();

// bodyParser для сбора JSON-формата
app.use(bodyParser.json());
// разрешаем прием веб-страниц внутри POST-запроса
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://mongo:27017/Meta', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'public')));

// подключаем роуты, не требующие авторизации
// роут регистрации создаёт пользователя
// с переданными в теле email, password и name
app.post('/signup', createUser);

// роут логина проверяет переданные в теле почту и пароль и возвращает JWT
app.post('/signin', login);

// подключаем роуты, требующие авторизации
app.use('/', auth, usersRoutes);

// здесь обрабатываем все ошибки
app.use(CentralizedErrorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
