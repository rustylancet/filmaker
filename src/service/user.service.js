const connection = require("../app/database");

class UserService {
  /**
   * 创建用户/注册
   */
  async create(user) {
    const {
      name,
      phone,
      email,
      password,
      myclass,
      stu_number,
      wechat,
      qq,
      intro
    } = user;
    // console.log(user);
    const statement = `INSERT INTO user (name,  phone, email, password, myclass, stu_number, wechat, qq, intro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    await connection.execute(statement, [
      name,
      phone,
      email,
      password,
      myclass,
      stu_number,
      wechat,
      qq,
      intro
    ]);
    const statement2 = `select max(user_id) as user_id from user `;
    const [resultSql] =  await connection.execute(statement2);
    return resultSql[0].user_id;
  }

  /**
   * 获取所有用户
   */
  async getAll(user_id) {
    const statement = `
    SELECT a.user_id,
       a.name,
       a.myclass,
       a.phone,
       a.wechat,
       a.qq,
       JSON_ARRAYAGG(JSON_OBJECT('film_id', c.film_id, 'film_name', c.film_name, 'film_pic', c.film_pic, 'job', e.type_name))  as films
  FROM user a
  left join make b on a.user_id= b.user_id
  left join film c on b.film_id= c.film_id
  left join work_type e on b.work_type= e.type_id
  where a.user_id = ?
  group BY a.user_id
    `;
    const resultSql = await connection.execute(statement, [user_id]);

    return resultSql[0];
  }

  /**
   * 根据id查找用户所有信息
   */
  async getUserById(user_id) {
    const statement = `
    SELECT a.user_id,
       a.name,
       a.avatar_url,
       a.myclass as class,
       a.phone,
       a.email,
       a.stu_number,
       a.wechat, 
       a.qq,
       a.intro
  FROM user a
  where a.user_id = ?`;
    const resultSql = await connection.execute(statement, [user_id]);

    return resultSql[0];
  }
  /**
   * 修改用户信息
   */
  async updateUserById(user, user_id) {
    const {
      name,
      phone,
      email,
      myclass,
      stu_number,
      wechat,
      qq,
      intro
    } = user;
    const statement = `UPDATE user SET name = ?, phone = ?, email = ?, myclass = ?, stu_number = ?, wechat = ?, qq = ?, intro = ? WHERE user_id = ?;`;
    const resultSql = await connection.execute(statement, [
      name,
      phone,
      email,
      myclass,
      stu_number,
      wechat,
      qq,
      intro,
      user_id,
    ]);

    return resultSql[0];
  }

  /**
   * 根据手机查找用户
   */
  async getUserByPhone(phone) {
    const statement = "SELECT * FROM `user` WHERE `phone` = ?";
    const resultSql = await connection.execute(statement, [phone]);

    return resultSql[0];
  }

  // DATE_FORMAT(b.maketime,'%Y-%m') as maketime,
  //   DATE_FORMAT(b.createtime,'%Y-%m-%d') as createtime,
  async getOrderCollection(user_id) {
    console.log(user_id);
    const statement = `
    SELECT a.collection_id,
       b.order_id,
       d.type_name,
       DATE_FORMAT(b.createtime, '%Y-%m-%d') as createtime,
       b.location,
       b.maketime,
       b.orderdetail,
       b.price,
       b.result,
       JSON_OBJECT('poster_name', c.name, 'poster_class', c.myclass, 'poster_avatar', c.avatar_url, 'phone', c.phone)  as poster
  FROM collection a
  left join demand b ON a.production_id= b.order_id
  left join user c on c.user_id= b.poster_id
  left join work_type d on b.order_type= d.type_id
 WHERE a.user_id= ?
   AND a.type= 1
 group BY a.collection_id`;
    const resultSql = await connection.execute(statement, [user_id]);

    return resultSql[0];
  }

  async getPersonCollection(user_id) {
    // console.log(user_id);
    const statement = `
    SELECT a.collection_id,
       b.user_id,
       b.name,
       b.myclass AS class,
       b.email,
       b.avatar_url,
       JSON_ARRAYAGG(JSON_OBJECT('film_id', c.film_id, 'film_name', c.film_name, 'job', d.type_name))  as films
  FROM collection a
  left join user b on a.production_id= b.user_id
  left join make e on b.user_id= e.user_id
  left join film c on e.film_id= c.film_id
  left join work_type d on e.work_type= d.type_id
 WHERE a.user_id= ?
   AND a.type= 3
 group BY a.collection_id
    `;
    const resultSql = await connection.execute(statement, [user_id]);

    return resultSql[0];
  }

  async getFilmCollection(user_id) {
    const statement = `
    SELECT a.collection_id,
    b.film_id,
    b.film_name,
    b.film_pic,
    b.time,
    c.type_name,
    JSON_ARRAYAGG(JSON_OBJECT('job', e.type_name, 'user_id', f.user_id, 'name', f.name, 'class', f.myclass, 'avatar_url', f.avatar_url))  as team
FROM collection a
left join film b on a.production_id= b.film_id
left join watch_type c ON b.type= c.type_id
left join make d on d.film_id= b.film_id
left join work_type e on e.type_id= d.work_type
left join user f on f.user_id= d.user_id
WHERE a.user_id= ?
AND a.type= 2
group BY a.collection_id
    `;
    const resultSql = await connection.execute(statement, [user_id]);

    return resultSql[0];
  }

  async getExihiCollection(user_id) {
    const statement = `
    SELECT a.collection_id,
       b.exhibition_id,
       b.Onshow,
       b.location,
       b.show_time,
       c.film_id,
       c.film_name,
       c.time,
       c.detail,
       c.film_pic,
       JSON_ARRAYAGG(JSON_OBJECT('job', e.type_name, 'name', f.name))  as team
  FROM collection a
  left JOIN exhibition b ON a.production_id= b.exhibition_id
  left JOIN film c on c.film_id = b.production_id
  left JOIN make d on d.film_id= b.production_id
  left JOIN work_type e ON e.type_id= d.work_type
  left JOIN user f on f.user_id= d.user_id
 WHERE a.user_id= ?
   AND a.type= 4
 group BY a.collection_id
    `;
    const resultSql = await connection.execute(statement, [user_id]);

    return resultSql[0];
  }

  async cancelCollection(collection_id) {
    console.log(collection_id)
    const statement = `DELETE FROM collection WHERE collection_id = ? ;`;
    const resultSql = await connection.execute(statement, [collection_id]);

    return resultSql[0];
  }

  async getMyAppointment(user_id) {
    const statement = `
    SELECT *
  FROM appointment a
  left JOIN exhibition b ON a.exhibition_id= b.exhibition_id
  left join film c ON c.film_id= b.production_id
  left JOIN watch_type d on b.type = d.type_id
 WHERE user_id= ?
 group BY a.appointment_id`;
    const resultSql = await connection.execute(statement, [user_id]);

    return resultSql[0];
  }

  async getAppointmentDetail(appointment_id) {
    const statement = `
    SELECT a.appointment_id,
       a.exhibition_id,
       b.location,
       b.show_time,
       c.film_id,
       c.film_pic,
       c.film_name,
       d.name
  FROM appointment a
  left JOIN exhibition b ON a.exhibition_id= b.exhibition_id
  left join film c on c.film_id = b.production_id
  left join user d on d.user_id = a.user_id
  WHERE a.appointment_id= ?`;
    const resultSql = await connection.execute(statement, [appointment_id]);

    return resultSql[0];
  }

  async updateAvatarUrlById(avatarUrl, user_id) {
    const statement = `UPDATE user SET avatar_url = ? WHERE user_id = ?;`;
    const [result] = await connection.execute(statement, [avatarUrl, user_id]);
    return result;
  }

  /**
   * 获取用户基本信息
   */
  async getUserBaseInfo(user_id) {
    const statement = `
    SELECT a.user_id,
       a.name,
       a.myclass as class,
       a.email,
       a.intro,
       a.avatar_url
  FROM user a
 where a.user_id= ?
 group BY a.user_id`;
    const [result] = await connection.execute(statement, [user_id]);
    return result;
  }

  /**
   * 获取我的作品集
   */
  async getMyFilms(user_id){
    const statement = `
    SELECT user.name as name,
       user.myclass as class,
       user.avatar_url as avatar_url,
       user.intro,
       JSON_ARRAYAGG(JSON_OBJECT('film_id', film.film_id, "film_pic", film.film_pic, 'film_name', film.film_name, 'job', work_type.type_name)) as films
    FROM user
     left join make ON user.user_id= make.user_id
     left JOIN film ON make.film_id= film.film_id
     left join work_type ON make.work_type= work_type.type_id
    where user.user_id= ?; `;
    const [result] = await connection.execute(statement, [user_id]);
    return result[0];
  }

  async ifLike(type, production_id, user_id){
    const statement = `SELECT collection_id FROM collection where type = ? and production_id = ? and user_id = ?`;
    const [result] = await connection.execute(statement, [type, production_id, user_id]);
    return result[0];
  }

  //查看旧密码
  async oldPass(user_id) {
    const statement = `SELECT password from user where user_id = ?`;
    const [resultSql] = await connection.execute(statement, [user_id]);

    return resultSql[0].password;
  }

  async setPass(new1, user_id) {
    const statement = `UPDATE user set password = ? where user_id = ?`;
    const [resultSql] = await connection.execute(statement, [new1, user_id]);

    return resultSql[0];
  }

  async getCollectId(type, production_id, user_id) {
    const statement = `SELECT collection_id from  collection where user_id = ? and type = ? and production_id = ?`;
    const [resultSql] = await connection.execute(statement, [user_id, type, production_id]);

    return resultSql[0];
  }
}

module.exports = new UserService();
