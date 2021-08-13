const cardsRouter = require('express').Router();
const { validationCardId, validateCardCreate } = require('../middlewares/validation');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', validateCardCreate, createCard);
cardsRouter.delete('/cards/:cardId', validationCardId, deleteCard);
cardsRouter.put('/cards/:cardId/likes', validationCardId, likeCard);
cardsRouter.delete('/cards/:cardId/likes', validationCardId, dislikeCard);

module.exports = cardsRouter;
