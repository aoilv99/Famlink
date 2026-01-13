const db = require('../config/db');

/**
 * 日程調整（会いたい要望）のデータベース操作を行うモデル
 */
const Schedule = {
  // 新規スケジュール作成
  create: async (family_id, sender_name, meetup_type, time_ranges) => {
    // time_ranges はオブジェクトまたは配列なので文字列化して保存
    const [result] = await db.execute(
      'INSERT INTO schedules (family_id, sender_name, meetup_type, time_ranges) VALUES (?, ?, ?, ?)',
      [family_id, sender_name, meetup_type, JSON.stringify(time_ranges)]
    );
    return result.insertId;
  },

  // 家族ごとのスケジュール一覧取得
  findByFamilyId: async (family_id) => {
    const [rows] = await db.query(
      'SELECT * FROM schedules WHERE family_id = ? ORDER BY created_at DESC',
      [family_id]
    );
    return rows;
  },

  // ステータス更新
  updateStatus: async (id, status) => {
    const [result] = await db.execute(
      'UPDATE schedules SET status = ? WHERE id = ?',
      [status, id]
    );
    return result;
  }
};

module.exports = Schedule;
