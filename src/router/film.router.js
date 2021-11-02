const Router = require("koa-router");
const { create, all, select, detail, type, adopt, collect, search} = require("../controller/film.controller");
const { verifyAuth } = require("../middleware/user.middleware");

const filmRouter = new Router({ prefix: "/films" });

filmRouter.post("/", verifyAuth, create);
filmRouter.get("/all", function(req, res) {
    console.log(req.headers)
})
// filmRouter.get("/all/:type/:year", select);
filmRouter.get("/detail/:film_id", detail);
filmRouter.get("/type/:type_id", type);
filmRouter.post("/adopt", verifyAuth, adopt);
filmRouter.post("/collect/:film_id", verifyAuth, collect);

//搜索
filmRouter.get("/search/:key", search);

module.exports = filmRouter;
