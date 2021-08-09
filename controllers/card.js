const cardSchema = require('../models/card');
const NotFound = require('../errors/notFound');
const Forbidden = require('../errors/forbiddenError');
const ValidationError = require('../errors/validationError');

const ERROR_CODE = 400; //validation 
const ERROR_CODE_INFOUND = 404; // not found
const ERROR_CODE_SERV = 500;
const ERROR_CODE_FORB = 403; //forbbiden

module.exports.getCard = (req, res) => {
  cardSchema.find({})
    .populate('user')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err) {
       throw new ValidationError('Переданы некорректные данные при создании');
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  cardSchema.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err) {
        throw new ValidationError('Переданы некорректные данные при создании');
    }
})
};

module.exports.deleteCard = (req, res) => {
  cardSchema.findById(req.params.cardId)
    .then((card) => {
      if (card === null) {
        throw new ValidationError('Карточка с указанным _id не найдена');
      }
      if (card.owner !== req.user._id) {
        throw new Forbidden('Вы можете удалить только свою карточку');
      }
      cardSchema.findByIdAndRemove(req.params.cardId)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            res.status(ERROR_CODE).send({ message: 'Невалидный id' });
          } else if (err.message === 'NotFound') {
            res.status(ERROR_CODE_INFOUND).send({ message: 'Нет такой карточки' });
          } else {
            res.status(ERROR_CODE_SERV).send({ message: 'Произошла ошибка' });
          }
        });
    });
};

module.exports.likeCard = (req, res) => {
  cardSchema.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_INFOUND).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Невалидный id' });
      } else {
        res.status(ERROR_CODE_SERV).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  cardSchema.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_INFOUND).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Невалидный id' });
      } else {
        res.status(ERROR_CODE_SERV).send({ message: 'Ошибка по умолчанию' });
      }
    });
};
