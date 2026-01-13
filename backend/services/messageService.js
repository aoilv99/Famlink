const Message = require('../models/messageModel');

/**
 * メッセージ関連のビジネスロジックを担当するサービス
 */
const messageService = {
  // メッセージ保存
  postMessage: async (user_name, emotion, comment, family_id) => {
    return await Message.create(user_name, emotion, comment, family_id);
  },

  // メッセージ履歴取得
  getFamilyMessages: async (family_id) => {
    return await Message.findByFamilyId(family_id);
  }
};

module.exports = messageService;
