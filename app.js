const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use((req, res, next) => {
  req.user = {
    _id: '60c35a78e0346243e8f8a980', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use((req, res) => {
  res.status(404)
    .send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
