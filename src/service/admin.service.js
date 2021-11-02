const connection = require("../app/database");

class AdminService {
  /**
   * 获取所有用户
   */
  async getAllUsers() {
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
  group BY a.user_id`;
    const [resultSql] = await connection.execute(statement);

    return resultSql;
  }
  /**
   * 删除用户
   */
  async deleteUser(user_id) {
    const statement = `DELETE FROM user WHERE user_id = ?;`;
    const statement2 = `DELETE FROM user where user_id = ?`;
    let [resultSql] = "";
    try {
      resultSql = await connection.execute(statement, [user_id]);
      resultSql = await connection.execute(statement2, [user_id]);
    } catch (error) {
      resultSql = error;
    }

    return resultSql[0];
  }

  /**
   * 获取所有需求
   */
  async getAllOrders() {
    const statement = `
    SELECT a.order_id,
       b.type_name,
       a.location,
       a.maketime,
       DATE_FORMAT(a.createtime,'%Y-%m-%d') as createtime,
       a.orderdetail,
       a.price,
       a.result,
       a.groupvx,
       JSON_OBJECT('poster_name', c.name, 'poster_class', c.myclass, 'poster_avatar', c.avatar_url, 'phone', c.phone)  as poster
       FROM demand a,
            work_type b,
            user c
       WHERE a.order_type= b.type_id
        AND a.poster_id= c.user_id
    `;
    const [resultSql] = await connection.execute(statement);

    return resultSql;
  }

  /**
   * 删除需求
   * @param {*} order_id
   */
  async deleteOrder(order_id) {
    const statement = `DELETE FROM demand WHERE order_id = ? ;`;
    const [resultSql] = await connection.execute(statement, [order_id]);

    return resultSql;
  }

  /**
   * 获取所有作品
   */
  async getAllFilms() {
    const statement = `
    SELECT a.film_id,
    a.film_name,
    a.film_pic,
    year(a.time) as time,
    a.detail,
    e.type_name,
    JSON_ARRAYAGG(JSON_OBJECT('job', c.type_name, 'user_id', d.user_id, 'name', d.name, 'class', d.myclass, 'avatar_url', d.avatar_url))  AS team
FROM film a
left join make b ON a.film_id= b.film_id
left join work_type c ON b.work_type= c.type_id
left join user d on d.user_id= b.user_id
left JOIN watch_type e ON e.type_id= a.type
group BY a.film_id
    `;
    const [resultSql] = await connection.execute(statement);

    return resultSql;
  }

  /**
   * 新建作品
   * @param {*} film
   */
  async createFilm(film) {
    const { film_name, time, detail } = film;
    const statement = `INSERT INTO film (film_name, time, detail) VALUES (?, ?, ?) ;`;
    const [resultSql] = await connection.execute(statement, [
      film_name,
      time,
      detail,
    ]);

    return resultSql;
  }

  /**
   * 更新作品信息
   * @param {} film
   */
  async updateFilm(film) {
    const { film_name, time, detail, film_id } = film;
    const statement = `UPDATE film SET film_name = ?, time = ?, detail = ? WHERE film_id = ?;`;
    const [resultSql] = await connection.execute(statement, [
      film_name,
      time,
      detail,
      film_id,
    ]);

    return resultSql;
  }

  /**
   * 删除作品
   * @param {*} film_id
   */
  async deleteFilm(film_id) {
    const statement = `DELETE FROM film WHERE film_id = ?;`;
    const statement2 = `DELETE FROM make where film_id = ?`;
    var resultSql;
    try {
      resultSql = await connection.execute(statement, [film_id]);
      resultSql = await connection.execute(statement2, [film_id]);
    } catch (error) {
      resultSql = error;
    }
    return resultSql;
  }

  /**
   * 获取所有展映
   */
  async getAllExhibitions() {
    const statement = `
    SELECT a.exhibition_id, b.film_id, b.film_name, b.detail, b.film_pic, a.show_time, a.location, a.onshow, c.type_name,
JSON_ARRAYAGG(JSON_OBJECT('job', f.type_name, 'user_id', e.user_id, 'name', e.name, 'class', e.myclass, 'avatar_url', e.avatar_url))  AS team
  FROM exhibition a
  left join film b on a.production_id = b.film_id
  left JOIN watch_type c ON c.type_id = a.type
  left JOIN make d ON d.film_id = b.film_id
  left JOIN user e on e.user_id = d.user_id
  left JOIN work_type f on f.type_id = d.work_type
  group BY a.exhibition_id
    `;
    const [resultSql] = await connection.execute(statement);

    return resultSql;
  }

  /**
   * 新建展映
   */
  async createExhibition(exhibition) {
    const { production_id, location, show_time } = exhibition;
    // console.log(production_id, location, show_time);
    const statement = `INSERT INTO exhibition (production_id, location, show_time) VALUES (?, ?, ?) ;`;
    const [resultSql] = await connection.execute(statement, [
      production_id,
      location,
      show_time,
    ]);

    return resultSql;
  }

  /**
   * 更新展映信息
   */
  async updateExhibition(exhibition) {
    const { location, show_time, exhibition_id } = exhibition;
    console.log(location, show_time, exhibition_id);
    const statement = `UPDATE exhibition SET location = ?, show_time = ? WHERE exhibition_id = ?;`;
    const [resultSql] = await connection.execute(statement, [
      location,
      show_time,
      exhibition_id,
    ]);

    return resultSql;
  }

  /**
   * 删除展映
   */
  async deleteExhibition(exhibition_id) {
    const statement = `DELETE FROM exhibition WHERE exhibition_id = ?;`;
    const [resultSql] = await connection.execute(statement, [exhibition_id]);

    return resultSql;
  }

  /**
   * 获取所有预约
   */
  async getAllAppointments() {
    const statement = `
    SELECT a.appointment_id,
       c.film_name,
       d.location,
       d.show_time,
       JSON_OBJECT('user_id', b.user_id, 
       'name', b.name, 
       'phone', b.phone)  as user
  FROM appointment a
  left join user b on a.user_id= b.user_id
  left join exhibition d on a.exhibition_id= d.exhibition_id
  left join film c on d.production_id= c.film_id
 group by a.appointment_id
    `;
    const [resultSql] = await connection.execute(statement);

    return resultSql;
  }

  /**
   * 删除预约
   */
  async deleteAppointment(appointment_id) {
    const statement = `DELETE FROM appointment WHERE appointment_id = ?;`;
    const [resultSql] = await connection.execute(statement, [appointment_id]);

    return resultSql;
  }
}

module.exports = new AdminService();
