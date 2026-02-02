const ScheduleResponse = require('../models/scheduleResponseModel');
const Schedule = require('../models/scheduleModel');
const db = require('../config/db');

const scheduleResponseService = {
  // 回答を保存
  saveResponse: async (schedule_id, user_id, user_name, selected_time_slots) => {
    if (!schedule_id || !user_id || selected_time_slots === undefined || selected_time_slots === null) {
      throw new Error('必須項目が不足しています');
    }

    // 既に回答済みかチェック
    const hasResponded = await ScheduleResponse.hasUserResponded(schedule_id, user_id);
    if (hasResponded) {
      throw new Error('既に回答済みです');
    }

    // 回答を保存
    await ScheduleResponse.createOrUpdate(schedule_id, user_id, user_name, selected_time_slots);

    // 全員が回答したかチェック
    const isComplete = await scheduleResponseService.checkAllResponded(schedule_id);

    let autoDecided = false;
    let commonSlots = [];

    // 全員が回答したら、共通時間帯を計算
    if (isComplete) {
      commonSlots = await scheduleResponseService.findCommonTimeSlots(schedule_id);

      if (commonSlots.length === 1) {
        // 共通時間帯が1つだけ → 自動決定
        const finalSchedule = {
          selectedSlot: commonSlots[0],
          autoDecided: true,
          decidedAt: new Date().toISOString(),
          allResponses: await scheduleResponseService.calculateFinalSchedule(schedule_id)
        };
        await Schedule.updateFinalSchedule(schedule_id, finalSchedule);
        await Schedule.updateStatus(schedule_id, 'auto_decided');
        autoDecided = true;
      } else if (commonSlots.length > 1) {
        // 共通時間帯が複数 → 親に選択させる
        await Schedule.updateCommonSlots(schedule_id, commonSlots);
        await Schedule.updateStatus(schedule_id, 'pending_selection');
      } else {
        // 共通時間帯がない
        const finalSchedule = await scheduleResponseService.calculateFinalSchedule(schedule_id);
        await Schedule.updateFinalSchedule(schedule_id, finalSchedule);
        await Schedule.updateStatus(schedule_id, 'no_common_time');
      }
    }

    return {
      success: true,
      isComplete,
      autoDecided,
      commonSlots
    };
  },

  // 特定のスケジュールへの全回答を取得
  getResponses: async (schedule_id) => {
    return await ScheduleResponse.findByScheduleId(schedule_id);
  },

  // 全員が回答したかチェック
  checkAllResponded: async (schedule_id) => {
    // スケジュール情報を取得
    const [schedules] = await db.query(
      "SELECT family_id, sender_id FROM schedules WHERE id = ?",
      [schedule_id]
    );

    if (schedules.length === 0) {
      throw new Error('スケジュールが見つかりません');
    }

    const { family_id, sender_id } = schedules[0];
    
    if (!family_id || !sender_id) {
      throw new Error('スケジュールの家族情報が不完全です');
    }
    
    // 家族の全メンバー数を取得（送信者を除く）
    const [familyMembers] = await db.query(
      "SELECT COUNT(*) as count FROM users WHERE family_id = ? AND id != ?",
      [family_id, sender_id]
    );

    const expectedResponses = familyMembers[0].count;

    // 実際の回答数を取得
    const actualResponses = await ScheduleResponse.countByScheduleId(schedule_id);

    return actualResponses >= expectedResponses;
  },

  // 決まった日程を計算（全員の選択が重なる時間帯）
  calculateFinalSchedule: async (schedule_id) => {
    const responses = await ScheduleResponse.findByScheduleId(schedule_id);

    if (responses.length === 0) {
      return null;
    }

    // 各回答者の選択した時間帯を集計
    const allSelections = responses.map(response => {
      const slots = typeof response.selected_time_slots === 'string'
        ? JSON.parse(response.selected_time_slots)
        : response.selected_time_slots;
      return {
        user_name: response.user_name,
        slots: slots
      };
    });

    return allSelections;
  },

  // 全員の共通時間帯を見つける
  findCommonTimeSlots: async (schedule_id) => {
    const responses = await ScheduleResponse.findByScheduleId(schedule_id);

    if (responses.length === 0) {
      return [];
    }

    // 全員の選択した時間帯を取得
    const allUserSlots = responses.map(response => {
      const slots = typeof response.selected_time_slots === 'string'
        ? JSON.parse(response.selected_time_slots)
        : response.selected_time_slots;
      return slots || [];
    });

    // 誰も時間を選択していない場合
    if (allUserSlots.every(slots => slots.length === 0)) {
      return [];
    }

    // 最初のユーザーの選択を基準にする
    const baseSlots = allUserSlots[0];
    const commonSlots = [];

    // 各時間帯が他の全員にも含まれているかチェック
    for (const slot of baseSlots) {
      let isCommon = true;

      // 他の全ユーザーの選択をチェック
      for (let i = 1; i < allUserSlots.length; i++) {
        const userSlots = allUserSlots[i];

        // この時間帯が重なっているかチェック
        const hasOverlap = userSlots.some(userSlot =>
          scheduleResponseService.timeSlotsOverlap(slot, userSlot)
        );

        if (!hasOverlap) {
          isCommon = false;
          break;
        }
      }

      if (isCommon) {
        // 全員の重なる時間帯を計算
        const overlappingSlot = scheduleResponseService.calculateOverlappingSlot(
          slot,
          allUserSlots
        );

        if (overlappingSlot) {
          // 重複を避けるため、既存の共通時間帯と統合
          const existingIndex = commonSlots.findIndex(cs =>
            cs.date === overlappingSlot.date &&
            cs.startTime === overlappingSlot.startTime &&
            cs.endTime === overlappingSlot.endTime
          );

          if (existingIndex === -1) {
            commonSlots.push(overlappingSlot);
          }
        }
      }
    }

    return commonSlots;
  },

  // 2つの時間帯が重なっているかチェック
  timeSlotsOverlap: (slot1, slot2) => {
    if (slot1.date !== slot2.date) {
      return false;
    }

    const start1 = scheduleResponseService.timeToMinutes(slot1.startTime);
    const end1 = scheduleResponseService.timeToMinutes(slot1.endTime);
    const start2 = scheduleResponseService.timeToMinutes(slot2.startTime);
    const end2 = scheduleResponseService.timeToMinutes(slot2.endTime);

    return start1 < end2 && start2 < end1;
  },

  // 重なっている時間帯を計算
  calculateOverlappingSlot: (baseSlot, allUserSlots) => {
    let maxStart = scheduleResponseService.timeToMinutes(baseSlot.startTime);
    let minEnd = scheduleResponseService.timeToMinutes(baseSlot.endTime);

    // 全ユーザーの時間帯から最も遅い開始時刻と最も早い終了時刻を取得
    for (const userSlots of allUserSlots) {
      for (const slot of userSlots) {
        if (slot.date === baseSlot.date) {
          const start = scheduleResponseService.timeToMinutes(slot.startTime);
          const end = scheduleResponseService.timeToMinutes(slot.endTime);

          if (start < minEnd && end > maxStart) {
            maxStart = Math.max(maxStart, start);
            minEnd = Math.min(minEnd, end);
          }
        }
      }
    }

    // 重なる時間がない場合
    if (maxStart >= minEnd) {
      return null;
    }

    return {
      date: baseSlot.date,
      startTime: scheduleResponseService.minutesToTime(maxStart),
      endTime: scheduleResponseService.minutesToTime(minEnd)
    };
  },

  // 時間を分に変換
  timeToMinutes: (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  },

  // 分を時間に変換
  minutesToTime: (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }
};

module.exports = scheduleResponseService;
