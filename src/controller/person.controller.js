const fs = require("fs");

const personService = require("../service/person.service");
const globalService = require("../service/global.service");
class PersonController {
  async all(ctx, next) {
    const result = await personService.getAllPersons();

    ctx.body = result;
  }

  async detail(ctx, next) {
    const { user_id } = ctx.params;
    const result = await personService.getDetail(user_id);

    ctx.body = result;
  }

  async collect(ctx, next) {
    const { person_id } = ctx.params;
    const { user_id } = ctx.user;
    // console.log("i am ", user_id, "要收藏： ", person_id);
    var result = "";
    const ifcollect = await globalService.ifCollect(3, person_id, user_id);
    console.log("if:",ifcollect)
    if (!ifcollect || ifcollect == "" || ifcollect == undefined) {
      result = await globalService.collect(3, person_id, user_id);
    } else {
      result = "无法重复收藏~";
    }
    ctx.body = result;
  }
}

module.exports = new PersonController();
