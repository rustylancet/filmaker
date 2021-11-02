const connection = require("../app/database");

class OrderService {
  /**
   * 创建需求
   */
  async create(order, user_id) {
    const {
      order_type,
      groupvx,
      maketime,
      price,
      location,
      orderdetail,
    } = order;
    const statement = `INSERT INTO demand (order_type, poster_id, groupvx, maketime, price, location, orderdetail) VALUES (?, ?, ?, ?, ?, ?, ?);`;
    await connection.execute(statement, [
      order_type,
      user_id,
      groupvx,
      maketime,
      price,
      location,
      orderdetail,
    ]);

    const statement2 = `select max(order_id) as order_id from demand `;
    const [resultSql] = await connection.execute(statement2);
    return resultSql[0];
  }

  /**
   * 查看所有需求
   */
  async getAllOrders() {
    const statement = `
    SELECT a.order_id,
       b.type_name,
       b.type_id,
       a.location,
       a.maketime,
       DATE_FORMAT(a.createtime,'%Y-%m-%d') as createtime,
       a.orderdetail,
       a.price,
       a.result,
       JSON_OBJECT('poster_name', c.name, 'poster_class', c.myclass, 'poster_avatar', c.avatar_url, 'phone', c.phone)  as poster
       FROM demand a
       left join work_type b on a.order_type= b.type_id
       left join user c on a.poster_id= c.user_id
    `;
    const [resultSql] = await connection.execute(statement);

    return resultSql;
  }
  /**
   * 根据id获取需求
   */
  async getOrderById(order_id) {
    const statement = `
    SELECT a.order_id,
       b.type_name,
       b.type_id,
       a.location,
       a.maketime,
       DATE_FORMAT(a.createtime, '%Y-%m-%d')  as createtime,
       a.orderdetail,
       a.price,
       a.result,
       JSON_OBJECT('poster_id', c.user_id, 'poster_name', c.name, 'poster_class', c.myclass, 'poster_avatar', c.avatar_url, 'phone', c.phone) as poster
  FROM demand a
  LEFT JOIN work_type b ON a.order_type= b.type_id
  left join user c on a.poster_id= c.user_id
 where a.order_id= ?
    `;
    const [resultSql] = await connection.execute(statement, [order_id]);

    return resultSql[0];
  }

  /**
   * 获取特定类型需求
   */
  async getOrderByType(typeId) {
    const statement = `
    SELECT a.order_id,
    b.type_name,
    b.type_id,
    a.location,
    a.maketime,
    DATE_FORMAT(a.createtime,'%Y-%m-%d') as createtime,
    a.orderdetail,
    a.price,
    a.result,
    JSON_OBJECT('poster_id', c.user_id, 'poster_name', c.name, 'poster_class', c.myclass, 'poster_avatar', c.avatar_url, 'phone', c.phone)  as poster
    FROM demand a,
        work_type b,
        user c
    WHERE a.order_type= b.type_id
    AND a.poster_id= c.user_id
    AND a.order_type =?
    `;
    const [resultSql] = await connection.execute(statement, [typeId]);
    // console.log(resultSql);
    return resultSql;
  }

  /**
   * 接单
   */
  async takeOrder(order_id, user_id) {
    const statement =
      "INSERT INTO takeorder (taker_id, order_id) VALUES (?, ?)";
    await connection.execute(statement, [user_id, order_id]);
    const statement2 = `select max(takeorder_id) as takeorder_id from takeorder `;
    const [resultSql] = await connection.execute(statement2);

    return resultSql[0];
  }

  /**
   * 查看该需求所有接单者
   */
  async checkTakers(order_id) {
    const statement = `
    SELECT a.takeorder_id,
       d.type_name,
       b.type_id,
       c.createtime,
       c.location,
       c.maketime,
       c.orderdetail,
       c.price,
       c.result,
       c.groupvx,
       JSON_ARRAYAGG(JSON_OBJECT('user_id', b.user_id, 'name', b.name, 'class', b.myclass, 'avatar_url', b.avatar_url))  as takers
  FROM demand c
  left JOIN takeorder a on c.order_id= a.order_id
  left join user b on a.taker_id= b.user_id
  left JOIN work_type d ON d.type_id= c.order_type
  where c.order_id = ?
  group by c.order_id
    `;
    const [resultSql] = await connection.execute(statement, [order_id]);

    return resultSql;
  }

  /**
   * 确定人选
   */
  async decideTaker(order_id, taker_id) {
    const statement =
      "UPDATE demand SET result = 1 , answer_id = ? WHERE order_id = ?";
    await connection.execute(statement, [taker_id, order_id]);

    const statement2 = `DELETE FROM takeorder WHERE taker_id != ? and order_id = ?`;
    const statement3 = ` UPDATE takeorder SET result = 1 WHERE order_id = ?`;
    await connection.execute(statement2, [taker_id, order_id]);

    const [resultSql] = await connection.execute(statement3, [order_id]);
    return resultSql;
  }

  /**
   * 收藏需求
   */
  async collectOrder(order_id, user_id) {
    const statement =
      "INSERT INTO collection (type, production_id, user_id) VALUES (1, ?, ?)";
    const [resultSql] = await connection.execute(statement, [
      order_id,
      user_id,
    ]);

    return resultSql;
  }

  /**
   * 获取我的接单
   */
  async getMyTakeOrders(user_id) {
    const statement = `
    SELECT a.*,
       b.result,
       d.type_name,
       d.type_id,
       JSON_OBJECT('name', c.name, 'avatar_url', c.avatar_url, 'class', c.myclass) AS poster
  FROM demand a
  LEFT JOIN takeorder b on a.order_id= b.order_id
  LEFT JOIN user c on a.poster_id= c.user_id
  LEFT JOIN work_type d on d.type_id= a.order_type
 WHERE b.taker_id= ?
 GROUP BY a.order_id
    `;
    const [resultSql] = await connection.execute(statement, [user_id]);

    return resultSql;
  }

  /**
   * 获取我发布的订单信息
   */
  async getMyPost(user_id) {
    const statement = `
    SELECT a.order_id,
       c.type_name,
       c.type_id,
       a.createtime,
       a.location,
       a.maketime,
       a.orderdetail,
       a.price,
       a.result,
       a.groupvx,
       JSON_OBJECT('name', b.name, 'avatar_url', b.avatar_url, 'class', b.myclass)  AS poster,
       JSON_ARRAYAGG(JSON_OBJECT('user_id', e.user_id, 'name', e.name, 'class', e.myclass, 'avatar_url', e.avatar_url, 'intro', e.intro)) as takers
  FROM demand a
  left join user b on a.poster_id = b.user_id
  left JOIN work_type c ON c.type_id = a.order_type
  left JOIN takeorder d on d.order_id = a.order_id
  left join user e on d.taker_id = e.user_id
 where a.poster_id = ?
 group by a.order_id desc`;
    const [resultSql] = await connection.execute(statement, [user_id]);

    return resultSql;
  }

  /**
   * 获取我发布的具体订单信息
   */
  async getMyPostDetail(order_id) {
    const statement = `
      SELECT 
      c.order_id,
      d.type_name,
      d.type_id,
      c.createtime,
      c.location,
      c.maketime,
      c.orderdetail,
      c.price,
      c.result,
      c.groupvx,
      JSON_ARRAYAGG(JSON_OBJECT('user_id', b.user_id, 'name', b.name, 'class', b.myclass, 'avatar_url', b.avatar_url, 'intro', b.intro, 'phone', b.phone, 'wechat', b.wechat, 'qq', b.qq))  as takers
  FROM demand c
  left JOIN takeorder a on c.order_id= a.order_id
  left join user b on a.taker_id= b.user_id
  left JOIN work_type d ON d.type_id= c.order_type
  where c.order_id =?
      `;
    const [resultSql] = await connection.execute(statement, [order_id]);

    return resultSql[0];
  }
  async ifTake(order_id, user_id) {
    const statement = `SELECT * FROM takeorder WHERE order_id = ? AND taker_id = ?`;
    const [resultSql] = await connection.execute(statement, [
      order_id,
      user_id,
    ]);

    return resultSql;
  }

  /**
   * 获取我的成功接单详情
   */
  async getMySuccessTake(order_id) {
    const statement = `
      SELECT a.*,
      b.result,
      d.type_name,
      d.type_id,
      JSON_OBJECT('name', c.name, 'avatar_url', c.avatar_url, 'class', c.myclass, 'phone', c.phone, 'wechat', c.wechat, 'qq', c.qq)  AS poster
 FROM demand a
 LEFT JOIN takeorder b on a.order_id= b.order_id
 LEFT JOIN user c on a.poster_id= c.user_id
 LEFT JOIN work_type d on d.type_id= a.order_type
WHERE a.order_id= ? and  a.result = 1 
      `;
    const [resultSql] = await connection.execute(statement, [order_id]);

    return resultSql[0];
  }

  async deleteOrder(order_id) {
    const statement = `delete FROM demand WHERE order_id = ?`;
    const statement2 = `delete FROM takeorder WHERE order_id = ?`;
    await connection.execute(statement, [order_id]);
    const [resultSql] = await connection.execute(statement2, [order_id]);

    return resultSql;
  }

  async cancelTake(order_id, user_id) {
    const statement = `delete FROM takeorder WHERE order_id = ? and taker_id = ?`;
   
    const [resultSql] = await connection.execute(statement, [order_id, user_id]);

    return resultSql;
  }
}

module.exports = new OrderService();
