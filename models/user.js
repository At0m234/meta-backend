const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    new: true,
    select: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Почта не соответсвует требуемому формату',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  updated: {
    type: Date,
    default: Date.now(),
  },
});

// добавим метод поиска пользователя findUserByCredentials к схеме пользователя
userSchema.statics.findUserByCredentials = function findUser(email, password) {
  // попытаемся найти пользовател по почте
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        throw new UnauthorizedError('Неверная почта или пароль', 401);
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неверная почта или пароль', 401);
          }
          return user;
        });
    });
};

// добавим метод создания пользоваля createUserByCredentials к схеме пользователя
userSchema.statics.createUserByCredentials = function createUser(name, email, password, SALTROUNDS) {
  return this.findOne({ email })
    .then((user) => {
      if (user) {
        throw new BadRequestError('Пользователь с таким email уже зарегистрирован', 400);
      }
      // хешируем пароль
      return bcrypt.hash(password, SALTROUNDS)
        .then((hash) => {
          if (!hash) {
            throw new BadRequestError('Ошибка хеширования', 400);
          }
          // создаем юзера в базе
          return this.create({name, email, password: hash})
            .then((you) => {
              if (!you) {
                throw new BadRequestError('Ошибка записи данных', 400);
              }
              // ищем юзера и возвращаем данные без password
              return this.findOne({ email });
            });
        });
    });
};

module.exports = mongoose.model('user', userSchema);
