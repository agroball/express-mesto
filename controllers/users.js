const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFound');
const AuthError = require('../errors/authError');
const BadRequestError = require('../errors/BadRequest');
const EmailError = require('../errors/EmailError');

const { NODE_ENV, JWT_SECRET } = process.env;

const opts = { new: true, runValidators: true };

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь с таким ID не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

module.exports.getProfileMe = (req, res, next) => {
  const owner = req.user._id;
  User.findById(owner)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    throw new AuthError('Отсутствуют почта или пароль');
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.send({ data: { email: user.email, name: user.name } }))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new EmailError('Пользователь с таким email уже существует');
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Передана некорретная почта или пароль');
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { name, about }, opts)
    .orFail(() => {
      throw new NotFoundError('Пользователь с таким ID не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { avatar }, opts)
    .orFail(() => {
      throw new NotFoundError('Пользователь с таким ID не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AuthError('Не указаны логин или пароль');
  }
  User.findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new AuthError('Не найден пользователь с такой почтой');
    })
    .then((user) => {
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (!isValid) {
          next(new AuthError('Пароль некорректный'));
        }
        const userToken = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
          expiresIn: '7d',
        });
        res.send({ token: userToken });
      });
    })
    .catch(next);
};
