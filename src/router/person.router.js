const Router = require("koa-router");
const { all, detail, collect } = require("../controller/person.controller");
const { verifyAuth } = require("../middleware/user.middleware");

const personRouter = new Router({ prefix: "/persons" });

personRouter.get("/all", all);
personRouter.get("/detail/:user_id", detail);
personRouter.post("/collect/:person_id", verifyAuth, collect);

module.exports = personRouter;
