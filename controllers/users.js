require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');

// контроллер создает пользователя
const createUser = (req, res, next) => {
  const SALTROUNDS = 10;
  const {name, email, password} = req.body;

  return bcrypt.hash(email, SALTROUNDS)
    .then((hash) => {
      if (!hash) {
        throw new BadRequestError('Ошибка хэширования!', 400);
      }
      return User.createUserByCredentials(name, email, password, SALTROUNDS)
      // вернём записанные в базу данные
      .then((data) => {
        if (!data) {
          throw new BadRequestError('Произошла ошибка, не удалось создать пользователя', 400);
        }
        res.status(200).send(data);
      })
      // данные не записались, вернём ошибку
      .catch(next);
    })
    .catch(next);
};

// контроллер входа в систему и передачи JWT токена в LocalStorage браузера
const login = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверная почта или пароль', 401);
      }
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '24h' },
      );
      // вернём токен
      res.send(token);
    })
    // возвращаем ошибку аутентификации
    .catch(next);
};

// контроллер возвращает информацию о пользователе
const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((data) => {
      if (!data) {
        throw new BadRequestError('Неверный id пользователя', 400);
      } else {
        res.status(200).send(data);
      }
    })
    .catch(next);
};

module.exports = {
  getUserInfo,
  createUser,
  login,
};
