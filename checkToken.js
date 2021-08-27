const jwt = require('jsonwebtoken');

const YOUR_JWT = 'b2933805b07019932dac89a98a4d93adbd7c5561599d2db9a6b92b2e5825c12e';

const SECRET_KEY_DEV = 'dc63b407-867c-4698-ab85-c3ed97052e84';

try {
  const payload = jwt.verify(YOUR_JWT, SECRET_KEY_DEV); // eslint-disable-line

  console.log('\x1b[31m%s\x1b[0m', `
      Надо исправить. В продакшне используется тот же
      секретный ключ, что и в режиме разработки.
    `);
} catch (err) {
  if (err.type === 'JsonWebTokenError' && err.message === 'invalid signature') {
    console.log(
      '\x1b[32m%s\x1b[0m',
      'Всё в порядке. Секретные ключи отличаются',
    );
  } else {
    console.log(
      '\x1b[33m%s\x1b[0m',
      'Что-то не так',
      err,
    );
  }
}
