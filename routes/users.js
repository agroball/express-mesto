const usersRouter = require('express').Router();
const { validateUserId, validateUserInfo, validateUserAvatar } = require('../middlewares/validation');
const {
  getUsers, updateUser, updateAvatar, getProfileMe, getUser,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/me', getProfileMe);
usersRouter.get('/users/:userId', validateUserId, getUser);
usersRouter.patch('/users/me', validateUserInfo, updateUser);
usersRouter.patch('/users/me/avatar', validateUserAvatar, updateAvatar);

module.exports = usersRouter;
