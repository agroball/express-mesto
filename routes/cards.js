const cardsRouter = require('express').Router();
const { validateId, validateCard } = require('../middlewares/validation');
const {
  getCard, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');

cardsRouter.get('/cards', getCard);
cardsRouter.post('/cards', validateCard, createCard);
cardsRouter.delete('/cards/:cardId', validateId, deleteCard);
cardsRouter.put('/cards/:cardId/likes', validateId, likeCard);
cardsRouter.delete('/cards/:cardId/likes', validateId, dislikeCard);

module.exports = cardsRouter;
