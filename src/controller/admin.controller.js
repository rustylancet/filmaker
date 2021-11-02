const fs = require("fs");

const adminService = require("../service/admin.service");
const globalService = require("../service/global.service");

class AdminController {
  //用户
  async allUsers(ctx, next) {
    const result = await adminService.getAllUsers();

    ctx.body = result;
  }

  async deleteUser(ctx, next) {
    const { user_id } = ctx.params;
    const result = await adminService.deleteUser(user_id);

    ctx.body = result;
  }
  //需求
  async allOrders(ctx, next) {
    const result = await adminService.getAllOrders();

    ctx.body = result;
  }

  async deleteOrder(ctx, next) {
    const { order_id } = ctx.params;
    const result = await adminService.deleteOrder(order_id);

    ctx.body = result;
  }
  //作品
  async allFilms(ctx, next) {
    const result = await adminService.getAllFilms();

    ctx.body = result;
  }

  async createFilm(ctx, next) {
    const film = ctx.request.body;
    const result = await adminService.createFilm(film);

    ctx.body = result;
  }

  async updateFilm(ctx, next) {
    const film = ctx.request.body;
    const result = await adminService.updateFilm(film);

    ctx.body = result;
  }

  async deleteFilm(ctx, next) {
    const { film_id } = ctx.params;
    const result = await adminService.deleteFilm(film_id);

    ctx.body = result;
  }

  //展映
  async allExhibition(ctx, next) {
    const result = await adminService.getAllExhibitions();

    ctx.body = result;
  }
  async createExhibition(ctx, next) {
    const exhibition = ctx.request.body;
    const result = await adminService.createExhibition(exhibition);

    ctx.body = result;
  }

  async updateExhibition(ctx, next) {
    const exhibition = ctx.request.body;
    const result = await adminService.updateExhibition(exhibition);

    ctx.body = result;
  }

  async deleteExhibition(ctx, next) {
    const { exhibition_id } = ctx.params;
    const result = await adminService.deleteExhibition(exhibition_id);

    ctx.body = result;
  }

  //预约
  async allAppointments(ctx, next) {
    const result = await adminService.getAllAppointments();

    ctx.body = result;
  }
  async deleteAppointment(ctx, next) {
    const { appointment_id } = ctx.params;
    const result = await adminService.deleteAppointment(appointment_id);

    ctx.body = result;
  }
}

module.exports = new AdminController();
