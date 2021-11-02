const Router = require("koa-router");
const { create, all, ifshow, detail, collect, appoint, ifappoint} = require("../controller/exhibition.controller");
const { verifyAuth } = require("../middleware/user.middleware");

const exhibitionRouter = new Router({ prefix: "/exhibitions" });

exhibitionRouter.post("/", verifyAuth, create);
exhibitionRouter.get("/all", all);
//正在展映/已经结束
exhibitionRouter.get("/:ifshow", ifshow);
exhibitionRouter.get("/detail/:exhibition_id", detail);
exhibitionRouter.post("/collect/:exhibition_id", verifyAuth, collect);
//预约
exhibitionRouter.post("/appoint", verifyAuth, appoint);
exhibitionRouter.post("/ifappoint/:exhibition_id",verifyAuth, ifappoint);
module.exports = exhibitionRouter;
