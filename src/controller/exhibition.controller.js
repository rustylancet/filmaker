const fs = require("fs");

const exhibitionSerice = require("../service/exhibition.service");
const globalService = require("../service/global.service");

class ExhibitionController {
  async create(ctx, next) {
    const exhibition = ctx.request.body;
    const result = await exhibitionSerice.create(exhibition);
    //result: exhibition_id
    ctx.body = result;
  }

  async all(ctx, next) {
    const result = await exhibitionSerice.getAllExhibitions();

    ctx.body = result;
  }

  async ifshow(ctx, next) {
    const { ifshow } = ctx.params;
    const result = await exhibitionSerice.getExhibitions(ifshow);

    ctx.body = result;
  }

  async detail(ctx, next) {
    const { exhibition_id } = ctx.params;
    const result = await exhibitionSerice.getDetail(exhibition_id);

    ctx.body = result;
  }

  async collect(ctx, next) {
    const { exhibition_id } = ctx.request.body;
    const { user_id } = ctx.user;
    console.log(4, exhibition_id, user_id);
    var result = "";
    const ifcollect = await globalService.ifCollect(4, exhibition_id, user_id);

    if (!ifcollect || ifcollect == "" || ifcollect == undefined) {
      await globalService.collect(4, exhibition_id, user_id);
      result = true;
    } else {
      result = false;
    }

    ctx.body = result;
  }

  async appoint(ctx, next) {
    const { exhibition_id } = ctx.request.body;
    const { user_id } = ctx.user;
    console.log(exhibition_id, user_id)
    const result = await exhibitionSerice.makeAppointment(
      exhibition_id,
      user_id
    );

    ctx.body = result;
  }

  async ifappoint(ctx, next) {
    const { exhibition_id } = ctx.params;
    // console.log(appointment)
    const { user_id } = ctx.user;
    let result = await exhibitionSerice.ifAppoint(exhibition_id, user_id);
    if (result) {
      result = true;
    } else {
      result = false;
    }
    ctx.body = result;
  }
}

module.exports = new ExhibitionController();
