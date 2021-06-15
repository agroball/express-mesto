const Card = require('../models/card');

const ERROR_CODE = 400;
const ERROR_CODE_INFOUND = 404;
const ERROR_CODE_SERV = 500;

module.exports.getCard = (req, res) => {
  Card.find({})
    .populate('user')
    .then(cards => res.send({ data: cards }))
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

  Card.create({ name, link, owner:req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err) {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании ' });
      } else {
        res.status(ERROR_CODE_SERV).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .populate('user')
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_INFOUND).send({ message: 'Карточка с указанным _id не найдена' });
        return
      } else {
        res.send(card);
      }
    })
    .catch(() => res.status(ERROR_CODE_SERV).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_INFOUND).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
        return
      } else {
        res.send(card);
      }
    })
    .catch(() => res.status(ERROR_CODE_SERV).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_INFOUND).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
        return
      } else {
        res.send(card);
      }
    })
    .catch(() => res.status(ERROR_CODE_SERV).send({ message: 'Ошибка по умолчанию' }));
};