const fs = require("fs");
const fileService = require("../service/file.service");
const userService = require("../service/user.service");
const { APP_HOST, APP_PORT } = require("../app/config");
const { PICTURE_PATH } = require("../constants/file-path");

class FileController {
  async saveAvatarInfo(ctx, next) {
    console.log(ctx.req.file);
    // 1.获取图像相关的信息
    const { filename, mimetype, size } = ctx.req.file;
    const { user_id } = ctx.params;;

    // 2.将图像信息数据保存到数据库中
    const result = await fileService.createAvatar(
      filename,
      mimetype,
      size,
      user_id
    );

    // 3.将图片地址保存到user表中APP_HOST=http://47.96.228.152
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/avatar/${user_id}`;
    console.log("avatarUrl", avatarUrl);
    await userService.updateAvatarUrlById(avatarUrl, user_id);

    // 4.返回结果
    ctx.body = "上传头像成功~";
  }

  async savePictureInfo(ctx, next) {
    console.log("savePictureInfo!!");
    // 1.获取图像信息
    const files = ctx.req.files;
    const { film_id } = ctx.params;
    // console.log("film_id", film_id);
    // const { momentId } = ctx.query;

    // 2.将所有的文件信息保存到数据库中
    for (let file of files) {
      const { filename, mimetype, size } = file;
      // const avatarUrl = `${APP_HOST}:${APP_PORT}/films/avatar/${user_id}`;
      await fileService.createFile(filename, mimetype, size, film_id);
    }
    // 3.将图片地址保存到film表中
    const picUrl = `${APP_HOST}:${APP_PORT}/upload/images/${film_id}`;
    console.log("picUrl", picUrl);
    await fileService.updateFilmPic(picUrl, film_id);

    ctx.body = "配图上传完成~";
  }

  async fileInfo(ctx, next) {
    let { film_id } = ctx.params;
    const fileInfo = await fileService.getFileByFileId(film_id);
    // const { type } = ctx.params;
    // const types = ["small", "middle", "large"];
    // if (types.some((item) => item === type)) {
    //   fileInfo.filename = fileInfo.filename + "-" + type;
    // }
    console.log(fileInfo)
    ctx.response.set("content-type", fileInfo.mimetype);
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${fileInfo.filename}`);

  }
}

module.exports = new FileController();
