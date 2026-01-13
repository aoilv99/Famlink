const mysql = require('mysql2');

// MySQL接続設定
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('MySQL接続エラー:', err);
    return;
  }
  console.log('MySQLに接続成功！');

  // カラムの追加（存在確認を行ってから実行）
  db.query("SHOW COLUMNS FROM users LIKE 'invite_code'", (err, results) => {
    if (err) {
      console.error('カラム確認エラー:', err);
      return;
    }
    
    if (results.length === 0) {
      const addColumnSql = "ALTER TABLE users ADD COLUMN invite_code VARCHAR(20) UNIQUE";
      db.query(addColumnSql, (err) => {
        if (err) {
          console.error('カラム追加エラー:', err);
        } else {
          console.log('invite_code カラムを新しく追加しました');
        }
      });
    } else {
      console.log('invite_code カラムは既に存在します');
    }
  });
});

module.exports = db.promise(); // promiseベースのクエリを使えるようにする
