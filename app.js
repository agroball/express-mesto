require('dotenv').config();
const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/notFound');
const { validateNewUser, validateLogin } = require('./middlewares/validation');
const errorAll = require('./middlewares/error');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.post('/signup', validateNewUser, createUser);
app.post('/signin', validateLogin, login);

app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('*', (req, res, next) => next(new NotFoundError('Ресурс не найден')));
app.use(errorAll);
app.use(errors());

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Ссылка на сервер: http://localhost:${PORT}`);
});
