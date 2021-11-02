const Router = require('koa-router');

const {
} = require('../middleware/user.middleware');
const {
  avatarHandler,
  pictureHandler,
  pictureResize
} = require('../middleware/file.middleware');
const {
  saveAvatarInfo,
  savePictureInfo,
  fileInfo
} = require('../controller/file.controller');

const fileRouter = new Router({prefix: '/upload'});

fileRouter.post('/avatar/:user_id', avatarHandler, saveAvatarInfo);
fileRouter.post('/picture/:film_id', pictureHandler, savePictureInfo);

fileRouter.get('/images/:film_id', fileInfo);
// userRouter.get('/avatar/:user_id', avatarInfo);
module.exports = fileRouter;