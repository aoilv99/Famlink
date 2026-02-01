const scheduleService = require('../services/scheduleService');
const messageService = require('../services/messageService');
const scheduleResponseService = require('../services/scheduleResponseService');

/**
 * 通知統合エンドポイント
 * schedules と messages を一度に取得
 */
const notificationController = {
  // 家族の全通知を取得（スケジュール + メッセージ）
  getNotifications: async (req, res) => {
    const { family_id } = req.params;
    console.log(`API Request: GET /api/notifications/${family_id}`);

    try {
      // 並列で取得してパフォーマンスを向上
      const [schedules, messages] = await Promise.all([
        scheduleService.getFamilySchedules(family_id),
        messageService.getFamilyMessages(family_id)
      ]);

      // 各スケジュールに対して、既存の回答から絞り込まれた候補を追加
      const schedulesWithFiltered = await Promise.all(
        schedules.map(async (schedule) => {
          const responses = await scheduleResponseService.getResponses(schedule.id);

          if (responses.length === 0) {
            // 回答がない場合は元の候補をそのまま返す
            return { ...schedule, filtered_time_ranges: null };
          }

          // 回答済みユーザーの選択した時間帯を集計
          const filteredSlots = notificationController.calculateFilteredSlots(responses);

          return {
            ...schedule,
            filtered_time_ranges: filteredSlots,
            response_count: responses.length
          };
        })
      );

      res.json({
        schedules: schedulesWithFiltered,
        messages
      });
    } catch (err) {
      console.error('通知取得エラー:', err.message);
      res.status(500).json({ message: err.message });
    }
  },

  // 既存の回答から絞り込まれた時間帯を計算
  calculateFilteredSlots: (responses) => {
    const allSelectedSlots = [];

    // 各回答者が選択した時間帯を集約
    responses.forEach(response => {
      const slots = typeof response.selected_time_slots === 'string'
        ? JSON.parse(response.selected_time_slots)
        : response.selected_time_slots;

      if (slots && slots.length > 0) {
        allSelectedSlots.push(...slots);
      }
    });

    if (allSelectedSlots.length === 0) {
      return [];
    }

    // 日付ごとにグループ化
    const slotsByDate = {};
    allSelectedSlots.forEach(slot => {
      if (!slotsByDate[slot.date]) {
        slotsByDate[slot.date] = [];
      }
      slotsByDate[slot.date].push({
        startTime: slot.startTime,
        endTime: slot.endTime
      });
    });

    // 日付ごとの時間帯を配列に変換
    return Object.keys(slotsByDate).map(date => ({
      date,
      ranges: slotsByDate[date]
    }));
  }
};

module.exports = notificationController;
