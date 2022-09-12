const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');
const NotFoundError = require('../utils/NotFoundError');
const BadRequestCode = require('../utils/BadRequestCode');
const UnauthorizedError = require('../utils/UnauthorizedError');
const ConflictError = require('../utils/ConflictError');
const InternalServerError = require('../utils/InternalServerError');

module.exports.getUserOne = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch((err) => {
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => {
          res.send(user);
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
            return;
          }
          if (err.name === 'ValidationError') {
            next(new BadRequestCode('Переданы некорректные данные'));
            return;
          }
          next(err);
        });
    })
    .catch(() => {
      next(new InternalServerError('Неожиданная ошибка'));
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestCode('Переданы некорректные данные'));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь не найден'));
      } else { next(err); }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Ошибка аунтификации'));
    });
};
