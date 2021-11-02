const fs = require("fs");
var Cookies = require("cookies");
const userService = require("../service/user.service");
const globalService = require("../service/global.service");
const jwt = require("jsonwebtoken");
const { PRIVATE_KEY } = require("../app/config");
const { log } = require("console");

const fileService = require("../service/file.service");
const { AVATAR_PATH } = require("../constants/file-path");

class UserController {
  //用户注册
  async create(ctx, next) {
    const user = ctx.request.body;
    const result = await userService.create(user);

    ctx.body = result;
  }

  /**
   * 用户登录
   */
  async login(ctx, next) {
    const { user_id, name } = ctx.user;
    const token = jwt.sign({ user_id, name }, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24 * 7,
      algorithm: "RS256",
    });

    ctx.body = { user_id, name, token };
  }

  /**
   * 修改个人信息
   */
  async update(ctx, next) {
    const user = ctx.request.body;
    const { user_id } = ctx.user;
    // console.log(user);
    const result = await userService.updateUserById(user, user_id);

    ctx.body = result;
  }

  /**
   * 获取用户个人信息
   */
  async userInfo(ctx, next) {
    const { user_id } = ctx.user;
    // console.log("user_id:",user_id);
    const result = await userService.getUserById(user_id);

    ctx.body = result;
  }

  async avatarInfo(ctx, next) {
    // 1.用户的头像是哪一个文件呢?
    const { user_id } = ctx.params;
    console.log(user_id);
    const avatarInfo = await fileService.getAvatarByUserId(user_id);

    // 2.提供图像信息
    ctx.response.set("content-type", avatarInfo.mimetype);
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`);
  }

  async collection_orders(ctx, next) {
    const { user_id } = ctx.user;
    const result = await userService.getOrderCollection(user_id);

    ctx.body = result;
  }

  async collection_films(ctx, next) {
    const { user_id } = ctx.user;
    var result = await userService.getFilmCollection(user_id);
    //去重
    for (var i = 0; i <= result.length - 1; i++) {
      result[i].team = await globalService.removalDuplicate(result[i].team);
    }

    ctx.body = result;
  }
  async collection_persons(ctx, next) {
    const { user_id } = ctx.user;
    // console.log(user_id);
    const result = await userService.getPersonCollection(user_id);

    ctx.body = result;
  }
  async collection_exhibitions(ctx, next) {
    const { user_id } = ctx.user;
    const result = await userService.getExihiCollection(user_id);
    //去重
    for (var i = 0; i <= result.length - 1; i++) {
      result[i].team = await globalService.removalDuplicate(result[i].team);
    }
    ctx.body = result;
  }

  async cancelCollection(ctx, next) {
    const { collection_id } =  ctx.params;
    console.log("collection_id: ", collection_id)
    const result = await userService.cancelCollection(collection_id);

    ctx.body = result;
  }

  
  async collectId(ctx, next) {
    const { type, production_id } =  ctx.request.body;
    console.log(type, production_id)
    const { user_id } = ctx.user;
    let result = await userService.getCollectId(type, production_id, user_id);

    if (result) {
      result = result.collection_id
    }
    ctx.body = result;
  }

  async appointment(ctx, next) {
    const { user_id } = ctx.user;
    console.log("user:", user_id);
    const result = await userService.getMyAppointment(user_id);

    ctx.body = result;
  }
  async appointment_detail(ctx, next) {
    const { appointment_id } = ctx.params;
    const result = await userService.getAppointmentDetail(appointment_id);

    ctx.body = result[0];
  }

  async myfilms(ctx, next) {
    const { user_id } = ctx.user;
    const result = await userService.getMyFilms(user_id);

    ctx.body = result;
  }
  async ifLike(ctx, next) {
    const { user_id } = ctx.user;
    const { type, production_id } = ctx.request.body;
    // console.log(type, production_id, user_id);
    let result = await userService.ifLike(type, production_id, user_id);
    if (!result) {
      result = false;
    }else {
      result = true
    }
    ctx.body = result;
  }

  async changePass(ctx, next) {
    const { user_id } = ctx.user;
    const { old, new1, new2 } = ctx.request.body;

    const right = await userService.oldPass(user_id);
    console.log(old, new1, new2, user_id, right);
    var result;
    if (right === old) {
      if (new1 === new2) {
        result = await userService.setPass(new1, user_id);
      } else {
        result = false;
      }
    } else {
      result = false;
    }
    ctx.body = result;
  }
}

module.exports = new UserController();
