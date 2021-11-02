const connection = require("../app/database");

class ExhibitionService {
  /**
   * 新建展映
   */
  async create(exhibition) {
    const { production_id, type, location, show_time } = exhibition;
    console.log(production_id, type, location, show_time);
    const statement = `INSERT INTO exhibition (production_id, type, location, show_time) VALUES (?, ?, ?, ?);`;
    const [resultSql] = await connection.execute(statement, [
      production_id,
      type,
      location,
      show_time,
    ]);

    return resultSql.insertId;
  }
  /**
   * 获取所有展映
   */
  async getAllExhibitions() {
    const statement = `
    SELECT *
  from exhibition a
  LEFT JOIN film b on a.production_id= b.film_id
  LEFT JOIN watch_type c on c.type_id = b.type
    `;
    const [resultSql] = await connection.execute(statement);

    return resultSql;
  }
  /**
   *  正在展映
   */
  async getExhibitions(ifshow) {
    const statement = `SELECT *
    from exhibition a
    LEFT JOIN film b on a.production_id= b.film_id
    LEFT JOIN watch_type c on c.type_id = b.type
    WHERE onshow = ?;`;
    const [resultSql] = await connection.execute(statement, [ifshow]);

    return resultSql;
  }

  /**
   * 展映详情
   * @param {*} exhibition_id
   */
  async getDetail(exhibition_id) {
    const statement = `
    SELECT a.exhibition_id,
       a.Onshow,
       a.location,
       a.show_time,
       b.film_name,
       b.detail,
       b.film_pic,
       f.type_name,
       JSON_ARRAYAGG(JSON_OBJECT('job', e.type_name, 'user', JSON_OBJECT('user_id', d.user_id, 'name', d.name, 'avatar_url', d.avatar_url))) AS team
  from exhibition a
  LEFT JOIN film b on a.production_id= b.film_id
  LEFT JOIN make c on b.film_id= c.film_id
  LEFT JOIN user d on d.user_id= c.user_id
  LEFT JOIN work_type e on e.type_id= c.make_id
  LEFT JOIN watch_type f on f.type_id = b.type
 WHERE exhibition_id= ?
 GROUP BY a.exhibition_id`;
    const [resultSql] = await connection.execute(statement, [exhibition_id]);

    return resultSql[0];
  }

  /**
   * 收藏展映
   */
  async collectExhibition(exhibition_id, user_id) {
    const statement =
      "INSERT INTO collection (type, production_id, user_id) VALUES (4, ?, ?)";
    const [resultSql] = await connection.execute(statement, [
      exhibition_id,
      user_id,
    ]);

    return resultSql[0];
  }

  /**
   * 预约展映
   */
  async makeAppointment(exhibition_id, user_id) {

    const statement = `INSERT INTO appointment (exhibition_id, user_id) VALUES (?, ?);`;

    await connection.execute(statement, [exhibition_id, user_id]);
    const statement2 = `select max(appointment_id) as appointment_id from appointment `;
    const [resultSql] = await connection.execute(statement2);
    return resultSql[0];
  }

  async ifAppoint(exhibition_id, user_id) {
    const statement =
      "select * from appointment where exhibition_id = ? and user_id = ?";
    const [resultSql] = await connection.execute(statement, [
      exhibition_id,
      user_id,
    ]);

    return resultSql[0];
  }
}

module.exports = new ExhibitionService();
