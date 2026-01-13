/**
 * 招待コード生成関数
 * 9桁の英数字（ABC-DEF-GHI形式）を生成します
 */
const generateInviteCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 9; i++) {
    if (i > 0 && i % 3 === 0) code += '-';
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

module.exports = { generateInviteCode };
