const Router = require("koa-router");
const {
  allUsers,
  deleteUser,
  allOrders,
  deleteOrder,
  allFilms,
  createFilm,
  updateFilm,
  deleteFilm,
  allExhibition,
  createExhibition,
  updateExhibition,
  deleteExhibition,
  allAppointments,
  deleteAppointment,
} = require("../controller/admin.controller");
const { verifyAuth } = require("../middleware/user.middleware");

const adminRouter = new Router({ prefix: "/admin" });

//用户
adminRouter.get("/user", verifyAuth, allUsers);
adminRouter.post("/user/delete/:user_id", verifyAuth, deleteUser);
//需求
adminRouter.get("/order", verifyAuth, allOrders);
adminRouter.post("/order/delete/:order_id", verifyAuth, deleteOrder);
//作品
adminRouter.get("/film", verifyAuth, allFilms);
adminRouter.post("/film/create", verifyAuth, createFilm);
adminRouter.post("/film/update", verifyAuth, updateFilm);
adminRouter.post("/film/delete/:film_id", verifyAuth, deleteFilm);
//展映
adminRouter.get("/exhibition", allExhibition);
adminRouter.post("/exhibition/create", verifyAuth, createExhibition);
adminRouter.post("/exhibition/update", verifyAuth, updateExhibition);
adminRouter.post("/exhibition/delete/:exhibition_id", verifyAuth, deleteExhibition);
//预约
adminRouter.get("/appointment", verifyAuth, allAppointments);
adminRouter.post("/appointment/delete/:appointment_id", verifyAuth, deleteAppointment);

module.exports = adminRouter;
