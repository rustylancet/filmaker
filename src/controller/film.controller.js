const fs = require("fs");

const filmService = require("../service/film.service");
const globalService = require("../service/global.service");

class FilmController {
  async create(ctx, next) {
    const film = ctx.request.body;
    const { job } = ctx.request.body;
    const { user_id } = ctx.user;
    console.log(job)
   
    const insertResult = await filmService.create(user_id, film);
    console.log("insertResult:", insertResult)
    for(var i = 0; i < job.length; i++) {
      await filmService.createMake(insertResult, user_id, job[i]);
    }

    ctx.body = insertResult;
  }

  async all(ctx, next) {
    const result = await filmService.getAllFilms();

    ctx.body = result;
  }

  async select(ctx, next) {
    const { type_id, time } = ctx.params;
    const result = await filmService.getFilmsBySelect(type_id, time);
    ctx.body = result;
  }

  async type(ctx, next) {
    const { type_id } = ctx.params;
    const result = await filmService.getFilmsByType(type_id);

    ctx.body = result;
  }

  async detail(ctx, next) {
    const { film_id } = ctx.params;
    const result = await filmService.getDetailById(film_id);

    ctx.body = result;
  }

  async adopt(ctx, next) {
    const { film_id, job } = ctx.request.body;
    const { user_id } = ctx.user;
    // console.log("用户",user_id, '认领作品',film_id,'的',job)
    const ifAdopt = await filmService.ifAdopt(job, user_id, film_id);
    var result;
    if (ifAdopt == "" || ifAdopt == null) {
      result = await filmService.createMake(film_id, user_id, job);
    } else {
      result = false;
    }

    ctx.body = result;
  }

  async collect(ctx, next) {
    const { film_id } = ctx.request.body;
    const { user_id } = ctx.user;
    var result = "";
    const ifcollect = await globalService.ifCollect(2, film_id, user_id);
    if (!ifcollect || ifcollect == "" || ifcollect == undefined) {
      await globalService.collect(2, film_id, user_id);
      result = true;
    } else {
      result = false;
    }
    ctx.body = result;
  }
  //   async ifCollect(ctx, next) {
  //     const { film_id } = ctx.params;
  //     const { user_id } = ctx.user;
  //     const result = await globalService.ifCollect(2, film_id, user_id);

  //     ctx.body = result;
  //   }

  async search(ctx, next) {
    const { key } = ctx.params;
    // console.log(key);
    const result = await filmService.search(key);
    ctx.body = result;
  }
}

module.exports = new FilmController();
