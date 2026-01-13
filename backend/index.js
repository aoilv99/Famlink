require('dotenv').config();
const express = require('express');
const cors = require('cors');

// ルートのインポート
const userRoutes = require('./routes/userRoutes');
const familyRoutes = require('./routes/familyRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// ルーティングの設定
app.use('/api', userRoutes); // register, login
app.use('/api/users', userRoutes); // :email (実際には register/login も通るが問題なし)
app.use('/api/families', familyRoutes); // create, join, leave
app.use('/api/messages', messageRoutes); // post, get

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
