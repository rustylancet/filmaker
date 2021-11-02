const connection = require("../app/database");

class GlobalService {
  async ifCollect(type, production_id, user_id) {
    const statement =
      "SELECT * FROM collection where type = ? and production_id = ? and user_id = ?";
    const [resultSql] = await connection.execute(statement, [
      type,
      production_id,
      user_id,
    ]);
    // console.log("result:  ", resultSql[0]);
    return resultSql[0];
  }

  async collect(type, production_id, user_id) {
    const statement =
      "INSERT INTO collection (type, production_id, user_id) VALUES (?, ?, ?)";
    await connection.execute(statement, [type, production_id, user_id]);
    const statement2 = `select max(collection_id) as collection_id from collection `;
    const [resultSql] = await connection.execute(statement2);

    return resultSql[0];
  }

  async collection_id(type) {
    const statement = "SELECT type_id FROM type WHERE type_engname = ? ";
    const [resultSql] = await connection.execute(statement, [type]);

    return resultSql[0];
  }

  /**
   * 去重
   * @param {团队人员-对象数组} arr
   */
  async removalDuplicate(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
      for (var j = i + 1; j < arr.length; j++) {
        if (arr[i].job == arr[j].job) {
          arr.splice(j, 1);
          //因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
          j--;
        }
      }
    }
    return arr;
  }

  async removalDuplicate2(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
      for (var j = i + 1; j < arr.length; j++) {
        if (arr[i].phone == arr[j].phone) {
          arr.splice(j, 1);
          //因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
          j--;
        }
      }
    }
    return arr;
  }
}

module.exports = new GlobalService();
