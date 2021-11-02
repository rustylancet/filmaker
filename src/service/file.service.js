const connection = require('../app/database');

class FileService {
  async createAvatar(filename, mimetype, size, user_id) {
    const del =  `delete from avatar WHERE user_id = ?;`;
    await connection.execute(del, [user_id]);
    
    const statement = `INSERT INTO avatar (filename, mimetype, size, user_id) VALUES (?, ?, ?, ?)`;
    const [result] = await connection.execute(statement, [filename, mimetype, size, user_id]);
    return result;
  }

  async getAvatarByUserId(user_id) {
    const statement = `SELECT * FROM avatar WHERE user_id = ?;`;
    const [result] = await connection.execute(statement, [user_id]);
    return result.pop();
  }

  async createFile(filename, mimetype, size, film_id) {
    // console.log(filename, mimetype, size, film_id);
    const del =  `delete from file WHERE film_id = ?;`;
    await connection.execute(del, [film_id]);

    const statement = `INSERT INTO file (filename, mimetype, size, film_id) VALUES (?, ?, ?, ?)`;
    const [result] = await connection.execute(statement, [filename, mimetype, size, film_id]);
    return result;
  }

  async getFileByFileId(film_id) {
    const statement = `SELECT * FROM file WHERE film_id = ?;`;
    const [result] = await connection.execute(statement, [film_id]);
    return result[0];
  }

  async updateFilmPic(picUrl, film_id) {
   
    const statement = `UPDATE film SET film_pic = ? WHERE film_id = ?;`;
    const [result] = await connection.execute(statement, [picUrl, film_id]);
    return result;
  }
}

module.exports = new FileService();