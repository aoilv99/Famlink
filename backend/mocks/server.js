const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('backend/mocks/db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// カスタムルート: 新規登録
server.post('/api/register', (req, res) => {
const { email, password, user_name } = req.body;

// 既存ユーザーチェック
const db = router.db;
const existingUser = db.get('users').find({ email }).value();

if (existingUser) {
  return res.status(409).json({ message: 'このメールアドレスは既に登録されています' });
}

// 新規ユーザー作成
const newUser = {
  id: Date.now(),
  email,
  password, // 本番環境ではハッシュ化が必要
  user_name: user_name || email.split('@')[0],
  family_id: null,
  invite_code: generateInviteCode(),
  created_at: new Date().toISOString()
};

db.get('users').push(newUser).write();

res.status(201).json({
  message: '登録完了！',
  userId: newUser.id,
  email: newUser.email,
  userName: newUser.user_name,
  invite_code: newUser.invite_code
});
});

// カスタムルート: ログイン
server.post('/api/login', (req, res) => {
const { email, password } = req.body;

const db = router.db;
const user = db.get('users').find({ email }).value();

if (!user) {
  return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
}

// パスワードチェック（モック環境では簡易チェック）
if (user.password !== password) {
  return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
}

res.json({
  message: 'ログイン成功',
  user: {
    id: user.id,
    email: user.email,
    user_name: user.user_name,
    family_id: user.family_id,
    invite_code: user.invite_code,
    created_at: user.created_at
  }
});
});

// カスタムルート: ユーザー情報取得（メールアドレスで）
server.get('/api/users/:email', (req, res) => {
const { email } = req.params;
const db = router.db;
const user = db.get('users').find({ email }).value();

if (!user) {
  return res.status(404).send('ユーザーが見つかりませんでした');
}

res.json({
  id: user.id,
  email: user.email,
  user_name: user.user_name,
  family_id: user.family_id,
  invite_code: user.invite_code,
  created_at: user.created_at
});
});

// 招待コード生成関数
function generateInviteCode() {
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
let code = '';
for (let i = 0; i < 9; i++) {
  code += chars.charAt(Math.floor(Math.random() * chars.length));
}
return code;
}

// デフォルトルート（json-server標準機能）
server.use('/api', router);

const PORT = 3001;
server.listen(PORT, () => {
console.log(`モックサーバーが起動しました: http://localhost:${PORT}`);
});
