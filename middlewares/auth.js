const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authError');

const { JWT_SECRET_KEY = 'secret_key' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    throw new AuthError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
