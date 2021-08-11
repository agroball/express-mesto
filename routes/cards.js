const cardsRouter = require('express').Router();
const { validateId, validateCard } = require('../middlewares/validation');
const {
  getCard, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');
const auth = require('../middlewares/auth');

cardsRouter.get('/cards', getCard);
cardsRouter.post('/cards', auth, validateCard, createCard);
cardsRouter.delete('/cards/:cardId', auth, validateId, deleteCard);
cardsRouter.put('/cards/:cardId/likes', auth, validateId, likeCard);
cardsRouter.delete('/cards/:cardId/likes', auth, validateId, dislikeCard);

module.exports = cardsRouter;
