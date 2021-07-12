const cardsRouter = require('express').Router();
const {
  getCard, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');
const auth = require('../middlewares/auth');

cardsRouter.get('/cards', getCard);
cardsRouter.post('/cards', auth, createCard);
cardsRouter.delete('/cards/:cardId', auth, deleteCard);
cardsRouter.put('/cards/:cardId/likes', auth, likeCard);
cardsRouter.delete('/cards/:cardId/likes', auth, dislikeCard);

module.exports = cardsRouter;
