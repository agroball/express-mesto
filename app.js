require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/notFound');
const { validationSignIn, validationSignUp } = require('./middlewares/validation');
const { errorAll } = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors({
  origin: 'https://agroball.sharli.nomoredomains.work',
  credentials: true,
}));

app.use(requestLogger);
app.use(helmet());
app.use(express.json());


app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signup', validationSignUp, createUser);
app.post('/signin', validationSignIn, login);

app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use(errorLogger);

app.use(errors());
app.use('*', (req, res, next) => next(new NotFoundError('Ресурс не найден')));
app.use(errorAll);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Ссылка на сервер: http://localhost:${PORT}`);
});
