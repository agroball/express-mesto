const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authError');

const { NODE_ENV, JWT_SECRET_KEY } = process.env;

module.exports = (req, res, next) => {
  const tokenCookie = req.cookies.jwt;

  if (!tokenCookie || !tokenCookie.startsWith('Bearer ')) {
    next(new AuthError('Необходима авторизация'));
  }

  const token = tokenCookie.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET_KEY : 'super-strong-secret');
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
