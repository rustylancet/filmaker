const Router = require("koa-router");
const {
  create,
  all,
  detail,
  type,
  takeOrder,
  takers,
  decide,
  collect,
  myTake,
  myPost,
  myPostDetail,
  mySuccessTake,
  deleteOrder,
  cancelTake
} = require("../controller/order.controller");
const { verifyAuth } = require("../middleware/user.middleware");

const demandRouter = new Router({ prefix: "/orders" });

demandRouter.post("/", verifyAuth, create);
demandRouter.get("/all", all);
demandRouter.get("/detail/:order_id", detail);

demandRouter.get("/type/:typeId", type);
//接单
demandRouter.post("/take/:order_id", verifyAuth, takeOrder);
//查看我的接单
demandRouter.get("/mytake", verifyAuth, myTake);
demandRouter.get("/mytake/success/detail/:order_id", verifyAuth, mySuccessTake);
//查看我的发布
demandRouter.get("/mypost", verifyAuth, myPost);
demandRouter.get("/mypost/detail/:order_id", verifyAuth, myPostDetail);
//查看所有接单者
demandRouter.get("/takers/:order_id", verifyAuth, takers);
//确定接单者
demandRouter.post("/decide", decide);
//收藏需求
demandRouter.post("/collect/:order_id", verifyAuth, collect);

//删除需求
demandRouter.post("/delete/:order_id", deleteOrder);

//撤销接单
demandRouter.post("/canceltake/:order_id", verifyAuth, cancelTake);

module.exports = demandRouter;
