const cardSchema = require('../models/card');
const BadRequestError = require('../errors/BadRequest');
const NotFoundError = require('../errors/notFound');
const ForbiddenError = require('../errors/forbiddenError');

module.exports.getCards = (req, res, next) => {
  cardSchema.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardSchema.create({ name, link, owner })
    .then((card) => cardSchema.findById(card._id)
      .populate(['owner', 'likes'])
      .then((cards) => res.send(cards))
      .catch((err) => {
        if (err.name === 'ValidationError' || err.name === 'CastError') {
          throw new BadRequestError('Переданы некорректные данные');
        }
      })
      .catch(next))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  cardSchema.findById(cardId)
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (userId !== String(card.owner._id)) {
        throw new ForbiddenError('Чужая карточка');
      }
      return cardSchema.findByIdAndRemove(cardId)
        .orFail(() => {
          throw new NotFoundError('Карточка не найдена');
        })
        .then((cards) => res.send(cards))
        .catch((err) => {
          if (err.name === 'ValidationError' || err.name === 'CastError') {
            throw new BadRequestError('Переданы некорректные данные');
          }
          throw new NotFoundError(err.message);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFoundError('Эту карточку нельзя лайкнуть');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFoundError('Эту карточку нельзя дизлайкнуть');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};
