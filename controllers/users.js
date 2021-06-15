const User = require('../models/user');

const ERROR_CODE = 400;
const ERROR_CODE_INFOUND = 404;
const ERROR_CODE_SERV = 500;

  module.exports.getUsers = (req, res) => {
    User.find({})
      .then((users) => {
        if (!users) {
          res.status(ERROR_CODE_INFOUND).send({ message: 'Пользователь по указанному _id не найден' });
          return
        } else {
          res.send({ data: users });
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
  .then((users) => {
      if (!users) {
        res.status(ERROR_CODE_INFOUND).send({ message: 'Пользователь по указанному _id не найден' });
        return
      } else {
        res.send({ data: users });
      }
    })
      .catch(() => res.status(ERROR_CODE_SERV).send({ message: 'Ошибка по умолчанию' }));
  };

  module.exports.createUser = (req, res) => {
    const { name, about, avatar } = req.body;

    User.create({ name, about, avatar })
      .then(user => res.send({ data: user }))
      .catch((err) => {
        if (err) {
          res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании ' });
        } else {
          res.status(ERROR_CODE_SERV).send({ message: 'Ошибка по умолчанию' });
        }
      });
  };

  module.exports.updateUser = (req, res) => {
    User.findById(req.user._id)
      .then((user) => {
        if (!user) {
          res.status(ERROR_CODE_INFOUND).send({ message: 'Пользователь с указанным _id не найден' });
          return
        } else {
          res.send({ data: user });
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

  module.exports.updateAvatar = (req, res) => {
    const { avatar } = req.body;

    User.findByIdAndUpdate(req.user._id, { avatar })
      .then((user) => {
        if (!user) {
          res.status(ERROR_CODE_INFOUND).send({ message: 'Пользователь с указанным _id не найден' });
          return
        } else {
          res.send({ data: user });
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