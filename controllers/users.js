const User = require('../models/user');

const ERROR_CODE = 400;
const ERROR_CODE_INFOUND = 404;
const ERROR_CODE_SERV = 500;
const ERROR_CODE_AUTH = 401;

const opts = { new: true, runValidators: true };

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        res.status(ERROR_CODE_INFOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(200).send({ data: users });
      }
    })
    .catch((err) => {
      if (err) {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании ' });
      } else {
        res.status(ERROR_CODE_SERV).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Невалидный id' });
      } else if (err.message === 'NotValidId') {
        res.status(ERROR_CODE_INFOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(ERROR_CODE_SERV).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  User.create({ name, about, avatar, email, password })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err) {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании ' });
      } else {
        res.status(ERROR_CODE_SERV).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, opts)
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_INFOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании ' });
      } else {
        res.status(ERROR_CODE_SERV).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, opts)
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_INFOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании' });
      } else {
        res.status(ERROR_CODE_SERV).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
if (err.name === 'AuthError') {
 res.status(ERROR_CODE_AUTH).send({ message: 'Невозможно авторизоваться' });
} else {
  res.status(ERROR_CODE_SERV).send({ message: 'Ошибка по умолчанию' });
}
    });
};