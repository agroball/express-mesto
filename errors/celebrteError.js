const validator = require('validator');
const { CelebtareError } = require('celebrate');

function validation(value) {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new CelebtareError('Некорректный URL');
  }
  return value;
}

module.exports = validation;
