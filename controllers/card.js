const Card = require('../models/card');

const ERROR_CODE = 400;
const ERROR_CODE_INFOUND = 404;
const ERROR_CODE_SERV = 500;
const ERROR_CODE_FORB = 403;

module.exports.getCard = (req, res) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err) {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании ' });
      } else {
        res.status(ERROR_CODE_SERV).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err) {
       throw res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании'});
      } else {
        throw res.status(ERROR_CODE_SERV).send({ message: 'Ошибка по умолчанию' });
      }
    });
};


module.exports.deleteCard = (req,res, next) => {
Card.findById(req.params.cardId)
.then ((card) => {
 if(card === null) {
   throw res.status(ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена'});
 }
 if (card.owner !== req.user._id) {
   throw res.status(ERROR_CODE_FORB).send({ message: 'Вы можете удалить только свою карточку'});
 }
Card.findByIdAndRemove(req.params.cardId)
.then((card) => {
  res.status(200).send(card);
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
})
});
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
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
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } },
    { new: true })
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
