const db = require('../config/db');

/**
 * 家族情報のデータベース操作を行うモデル
 */
const Family = {
  // 家族IDで家族を検索
  findById: async (family_id) => {
    const [rows] = await db.query('SELECT * FROM families WHERE family_id = ?', [family_id]);
    return rows[0];
  },

  // 新規家族グループ作成
  create: async (family_id, family_name) => {
    const [result] = await db.query(
      'INSERT INTO families (family_id, family_name) VALUES (?, ?)',
      [family_id, family_name]
    );
    return result;
  }
};

module.exports = Family;
