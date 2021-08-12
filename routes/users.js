const usersRouter = require('express').Router();
const { validateId, validateUserInfo, validateUserAvatar } = require('../middlewares/validation');
const {
  getUsers, updateUser, updateAvatar, getUserId,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);

// usersRouter.get('/users/me', getMyInfo);

usersRouter.get('/users/:userId', validateId, getUserId);

usersRouter.patch('/users/me', validateUserInfo, updateUser);
usersRouter.patch('/users/me/avatar', validateUserAvatar, updateAvatar);

module.exports = usersRouter;
