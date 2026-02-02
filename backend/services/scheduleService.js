const Schedule = require('../models/scheduleModel');

/**
 * 日程調整関連のビジネスロジックを担当するサービス
 */
const scheduleService = {
  // 要望の保存
  createSchedule: async (family_id, sender_name, meetup_type, time_ranges, sender_id) => {
    if (!family_id || !sender_name || !meetup_type || !time_ranges) {
      throw new Error('必須項目が不足しています');
    }
    return await Schedule.create(family_id, sender_name, meetup_type, time_ranges, sender_id);
  },

  // 家族の要望一覧取得
  getFamilySchedules: async (family_id) => {
    return await Schedule.findByFamilyId(family_id);
  },

  // 親が最終日程を選択
  selectFinalSlot: async (schedule_id, selected_slot, user_id) => {
    if (!schedule_id || !selected_slot) {
      throw new Error('必須項目が不足しています');
    }

    // スケジュールの送信者（親）を確認
    const db = require('../config/db');
    const [schedules] = await db.query(
      "SELECT sender_id, status FROM schedules WHERE id = ?",
      [schedule_id]
    );

    if (schedules.length === 0) {
      throw new Error('スケジュールが見つかりません');
    }

    const schedule = schedules[0];

    // 送信者（親）のみが選択できる
    if (schedule.sender_id !== user_id) {
      throw new Error('日程を選択する権限がありません');
    }

    // pending_selection状態のみ選択可能
    if (schedule.status !== 'pending_selection') {
      throw new Error('このスケジュールは選択できる状態ではありません');
    }

    // 選択した日程を保存
    return await Schedule.selectFinalSlot(schedule_id, selected_slot);
  }
};

module.exports = scheduleService;
