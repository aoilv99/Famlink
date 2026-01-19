const pool = require("../config/db");

const Message = {
  create: async (user_name, emotion, comment, family_id, user_id) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        "INSERT INTO messages (user_name, emotion, comment, family_id, user_id) VALUES (?, ?, ?, ?, ?)",
        [user_name, emotion, comment, family_id, user_id],
      );

      await connection.commit();

      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  findByFamilyId: async (family_id) => {
    const connection = await pool.getConnection();

    try {
      await connection.query("COMMIT");

      await connection.query(
        "SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED",
      );

      const [rows] = await connection.query(
        "SELECT * FROM messages WHERE family_id = ? ORDER BY created_at DESC",
        [family_id],
      );

      return rows;
    } finally {
      connection.release();
    }
  },
};

module.exports = Message;
