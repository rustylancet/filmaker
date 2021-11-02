const connection = require("../app/database");

class FilmService {
  /**
   * 创建新作品
   */
  async create(user_id, film) {
    const { film_name, type, time, detail, job } = film;
    //插入作品表
    const statement = `INSERT INTO film (film_name, type, time, detail) VALUES (?, ?, ?, ?);`;
   await connection.execute(statement, [
      film_name,
      type,
      time,
      detail,
    ]);
    const statement2 = `select max(film_id) as film_id from film `;
    const [resultSql] =  await connection.execute(statement2);
    return resultSql[0].film_id;
  }

  /**
   *添加制作关系
   */
  async createMake(film_id, user_id, job) {
    //插入制作表
    const statement = `INSERT INTO make(user_id, work_type, film_id)  VALUES (?, ?, ?) ;`;
    console.log(film_id, user_id, job);
    const [resultSql] = await connection.execute(statement, [
      user_id,
      job,
      film_id,
    ]);
    return resultSql[0];
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
   * 获取某一类型作品
   */
  async getFilmsByType(type_id) {
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
where a.type = ?
group BY a.film_id
    `;
    const [resultSql] = await connection.execute(statement, [type_id]);
    return resultSql;
  }

  async collectFilm(film_id, user_id) {
    const statement =
      "INSERT INTO collection (type, production_id, user_id) VALUES (2, ?, ?)";
    const [resultSql] = await connection.execute(statement, [film_id, user_id]);

    return resultSql[0];
  }

  /**
   * 获取制作团队
   */
  async getTeam(film_id) {
    const statement = `,
    SELECT JSON_ARRAYAGG(JSON_OBJECT('job', c.type_name, 'user_id', d.user_id, 'name', d.name, 'class', d.myclass, 'avatar_url', d.avatar_url))  AS team
    FROM film a
    left join make b ON a.film_id= b.film_id
    left join work_type c ON b.work_type= c.type_id
    left join user d on d.user_id= b.user_id
   WHERE a.film_id= ?`;
    const [resultSql] = await connection.execute(statement, [film_id]);

    return resultSql;
  }

  /**
   * 获取作品info
   */
  async getDetailById(film_id) {
    const statement = `
    SELECT a.film_id,
    a.film_name,
    a.film_pic,
    year(a.time) as time,
    a.detail,
    e.type_name,
    JSON_ARRAYAGG(JSON_OBJECT('job', c.type_name, 'user', JSON_OBJECT('user_id', d.user_id, 'name', d.name, 'avatar_url', d.avatar_url)))  AS team
FROM film a
left join make b ON a.film_id= b.film_id
left join work_type c ON b.work_type= c.type_id
left join user d on d.user_id= b.user_id
left JOIN watch_type e ON e.type_id= a.type
where a.film_id = ?
group BY a.film_id
    `;
    const [resultSql] = await connection.execute(statement, [film_id]);

    return resultSql[0];
  }
  async ifAdopt(work_type, user_id, film_id) {
    const statement = `SELECT * FROM make WHERE work_type = ? AND user_id = ? and film_id = ?`;
    const [resultSql] = await connection.execute(statement, [
      work_type,
      user_id,
      film_id,
    ]);

    return resultSql[0];
  }

  async search(key) {
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
where a.film_name like '%` + key  + `%'
group BY a.film_id
    `;
    const [resultSql] = await connection.execute(statement);
    return resultSql;
  }
}

module.exports = new FilmService();
