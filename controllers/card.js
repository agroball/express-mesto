const cardSchema = require('../models/card');
const ValidationError = require('../errors/validationError');
const NotFound = require('../errors/notFound');
const Forbidden = require('../errors/forbiddenError');

module.exports.getCard = (req, res, next) => {
  cardSchema.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  cardSchema.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next ( new ValidationError('Переданы некорректные данные при создании'));
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  cardSchema.findById(req.params.cardId)
    .orFail(new Error('WrongCarId'))
    .then((card) => {
      if (card === null) {
        throw new NotFound('Карточка с указанным _id не найдена');
      }
      if (card.owner !== req.user._id) {
        throw new Forbidden('Вы можете удалить только свою карточку');
      }
      cardSchema.findByIdAndRemove(req.params.cardId)
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            throw new ValidationError('Невалидный id');
          } else if (err.message === 'NotFound') {
            throw new NotFound('Нет такой карточки');
          } else {
            next(err);
          }
        });
    });
};

module.exports.likeCard = (req, res, next) => {
  cardSchema.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFound('Переданы некорректные данные для постановки/снятии лайка');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Невалидный id'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  cardSchema.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFound('Переданы некорректные данные для постановки/снятии лайка');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Невалидный id'));
      } else {
        next(err);
      }
    });
};
