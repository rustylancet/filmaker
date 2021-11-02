const connection = require("../app/database");

class OrderService {
  async getAllPersons() {
    const statement = `
    SELECT 
       user.user_id,   
       user.name as name,
       user.myclass as class,
       user.avatar_url as avatar_url,
       JSON_ARRAYAGG(JSON_OBJECT('film_id', film.film_id, 'film_name', film.film_name, 'job', work_type.type_name, "film_pic", film.film_pic))  as films
    FROM user
    left JOIN make on user.user_id= make.user_id
    left JOIN film on make.film_id= film.film_id
    left JOIN work_type on make.work_type= work_type.type_id
    left JOIN file on file.film_id = film.film_id
    GROUP BY user.user_id;`;
    const [resultSql] = await connection.execute(statement);

    return resultSql;
  }

  async getDetail(user_id) {
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
    where user.user_id= ?
    GROUP BY user.user_id; `;
    const [resultSql] = await connection.execute(statement, [user_id]);

    return resultSql[0];
  }
}

module.exports = new OrderService();
