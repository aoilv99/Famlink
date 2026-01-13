const db = require('../config/db');

/**
 * メッセージ（感情・コメント）のデータベース操作を行うモデル
 */
const Message = {
  // メッセージを保存
  create: async (user_name, emotion, comment, family_id) => {
    const [result] = await db.query(
      'INSERT INTO messages (user_name, emotion, comment, family_id) VALUES (?, ?, ?, ?)',
      [user_name, emotion, comment, family_id]
    );
    return result.insertId;
  },

  // 家族ごとのメッセージ履歴を取得
  findByFamilyId: async (family_id) => {
    const [rows] = await db.query(
      'SELECT * FROM messages WHERE family_id = ? ORDER BY created_at DESC',
      [family_id]
    );
    return rows;
  }
};

module.exports = Message;
