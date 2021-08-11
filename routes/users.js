const usersRouter = require('express').Router();
const { validateId, validateUserInfo, validateUserAvatar } = require('../middlewares/validation');
const {
  getUsers, updateUser, updateAvatar, getUserId,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:userId', validateId, auth, getUserId);
usersRouter.patch('/users/me', validateUserInfo, auth, updateUser);
usersRouter.patch('/users/me/avatar', validateUserAvatar, auth, updateAvatar);

module.exports = usersRouter;
