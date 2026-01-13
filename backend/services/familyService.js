const Family = require('../models/familyModel');
const User = require('../models/userModel');

/**
 * 家族管理関連のビジネスロジックを担当するサービス
 */
const familyService = {
  // 家族グループ作成
  createFamily: async (family_id, family_name, email) => {
    const existingFamily = await Family.findById(family_id);
    
    if (!existingFamily) {
      await Family.create(family_id, family_name || '家族');
    }
    
    await User.updateFamilyId(email, family_id);
    return family_id;
  },

  // 家族グループ参加
  joinFamily: async (code, email) => {
    const trimmedCode = code.trim();

    // 1. 直接家族IDとして存在するか確認
    const existingFamily = await Family.findById(trimmedCode);
    if (existingFamily) {
      await User.updateFamilyId(email, trimmedCode);
      return trimmedCode;
    }

    // 2. 招待コードとしてユーザーを検索
    const targetUser = await User.findByInviteCode(trimmedCode);
    if (!targetUser) {
      throw new Error('招待コードが正しくないか、家族グループが見つかりません');
    }

    let targetFamilyId = targetUser.family_id;

    if (!targetFamilyId) {
      // 招待した側がまだ家族を作っていない場合、新規作成
      targetFamilyId = targetUser.invite_code;
      try {
        await Family.create(targetFamilyId, '家族');
      } catch (err) {
        // 重複エラーは無視
        if (err.errno !== 1062) throw err;
      }
      // 招待した側もその家族に所属させる
      await User.updateFamilyId(targetUser.email, targetFamilyId);
    }

    // 参加する側の所属を更新
    await User.updateFamilyId(email, targetFamilyId);
    return targetFamilyId;
  },

  // 家族脱退
  leaveFamily: async (email) => {
    return await User.leaveFamily(email);
  }
};

module.exports = familyService;
