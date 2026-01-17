const db = require('../config/db');

/**
 * メッセージ（感情・コメント）のデータベース操作を行うモデル
 */
const Message = {
  // メッセージを保存
  create: async (user_name, emotion, comment, family_id) => {
    // 念のため正規化して保存
    const normalizedId = family_id ? family_id.toUpperCase().replace(/[^A-Z0-9]/g, '') : null;
    const [result] = await db.query(
      'INSERT INTO messages (user_name, emotion, comment, family_id) VALUES (?, ?, ?, ?)',
      [user_name, emotion, comment, normalizedId]
    );
    return result.insertId;
  },

  // 家族ごとのメッセージ履歴を取得
  findByFamilyId: async (family_id) => {
    // 検索時も正規化して比較
    const normalizedId = family_id ? family_id.toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
    const [rows] = await db.query(
      'SELECT * FROM messages WHERE REPLACE(REPLACE(UPPER(family_id), "-", ""), " ", "") = ? ORDER BY created_at DESC',
      [normalizedId]
    );
    return rows;
  }
};

module.exports = Message;
