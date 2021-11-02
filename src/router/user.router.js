const Router = require("koa-router");
const {
  create,
  login,
  update,
  userInfo,
  avatarInfo,
  collection_orders,
  collection_films,
  collection_persons,
  collection_exhibitions,
  cancelCollection,
  appointment,
  appointment_detail,
  myfilms,
  ifLike,
  changePass,
  collectId
} = require("../controller/user.controller");
const {
  verifyUser,
  verifyLogin,
  verifyAuth,
} = require("../middleware/user.middleware");

const userRouter = new Router({ prefix: "/users" });

userRouter.post("/", verifyUser, create);
//登录
userRouter.post("/login", verifyLogin, login);
//更新个人信息
userRouter.post("/update", verifyAuth, update);
userRouter.get("/info", verifyAuth, userInfo);
userRouter.post("/changepass", verifyAuth, changePass)
//换头像
userRouter.get('/avatar/:user_id', avatarInfo);

userRouter.get("/colllections/order", verifyAuth, collection_orders);
userRouter.get("/colllections/film", verifyAuth, collection_films);
userRouter.get("/colllections/person", verifyAuth, collection_persons);
userRouter.get("/colllections/exhibition", verifyAuth, collection_exhibitions);

userRouter.post("/collections/cancel/:collection_id", verifyAuth, cancelCollection);
//是否收藏
userRouter.post("/colllections/ifLike", verifyAuth, ifLike);
userRouter.post("/colllections/id", verifyAuth, collectId);

userRouter.get("/appointment", verifyAuth, appointment);
userRouter.get("/appointment/detail/:appointment_id", verifyAuth, appointment_detail);

userRouter.get('/myfilms', verifyAuth, myfilms);

module.exports = userRouter;
