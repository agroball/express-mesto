const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCard, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');
const auth = require('../middlewares/auth');

cardsRouter.get('/cards', getCard);

cardsRouter.post('/cards', auth, 
celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/),
  }),
}), createCard);

cardsRouter.delete('/cards/:cardId', auth,
celebrate({
  params: Joi.object().keys({
    _cardId: Joi.string().hex().required().length(24),
  }),
}), deleteCard);

cardsRouter.put('/cards/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    _cardId: Joi.string().required().hex().length(24),
  }),
}), likeCard);

cardsRouter.delete('/cards/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    _cardId: Joi.string().required().hex().length(24),
  }),
}), dislikeCard);

module.exports = cardsRouter;
