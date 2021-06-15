const cardsRouter = require('express').Router();
const { getCard, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/card');

cardsRouter.get('/cards', getCard);
cardsRouter.post('/cards', createCard);
cardsRouter.delete('/cards/:cardId', deleteCard);
cardsRouter.put('/cards/:cardId/likes', likeCard);
cardsRouter.delete('/cards/:cardId/likes', dislikeCard);

module.exports = cardsRouter;