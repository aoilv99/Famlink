require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // 追加: フロントからのアクセスを許可するため

const app = express();
app.use(express.json()); // JSON形式のデータを受け取れるようにする
app.use(cors());         // 違うポートからのアクセスを許可する

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
});

// --- API（データの通り道）の作成 ---

// 1. 感情データを保存する (POST)
app.post('/api/messages', (req, res) => {
  const { user_name, emotion, comment } = req.body;
  const sql = 'INSERT INTO messages (user_name, emotion, comment) VALUES (?, ?, ?)';
  
  db.query(sql, [user_name, emotion, comment], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: '保存完了！', id: result.insertId });
  });
});

// 2. 家族の様子を取得する (GET)
app.get('/api/messages', (req, res) => {
  const sql = 'SELECT * FROM messages ORDER BY created_at DESC';
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});