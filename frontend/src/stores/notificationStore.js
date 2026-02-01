import {create} from "zustand";

const getMeetupTypeText = (type) => {
  const types = {
    meal: "ご飯を食べたい",
    tea: "おしゃべりしたい",
    house: "顔を見たい",
    others: "会いたい",
  };
  return types[type] || "会いたい";
};

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    const familyId = localStorage.getItem("familyId");
    if (!familyId) {
      return;
    }

    if (get().loading) {
      return;
    }

    set({loading: true});

    try {
      const cacheBuster = `_=${new Date().getTime()}`;
      const notificationApiUrl = `${import.meta.env.VITE_API_URL}/api/notifications/${familyId}?${cacheBuster}`;

      const response = await fetch(notificationApiUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const { schedules, messages } = await response.json();

      console.log('Notifications:', { schedules, messages });

      // 現在のユーザーIDを取得
      const currentUserId = localStorage.getItem('userId');

      // スケジュール通知を作成
      const scheduleNotifications = schedules
        .filter((schedule) => {
          // 完了したスケジュールは全員に表示
          if (schedule.status === 'completed') {
            return true;
          }
          // それ以外は自分が送ったものを除外
          return String(schedule.sender_id) !== String(currentUserId);
        })
        .map((schedule) => {
          // time_rangesをパース（JSON文字列の場合）
          let timeRanges = schedule.time_ranges;
          if (typeof timeRanges === "string") {
            try {
              timeRanges = JSON.parse(timeRanges);
            } catch (e) {
              console.error("JSON parse error:", e);
              timeRanges = [];
            }
          }

          // 完了したスケジュールの場合（送信者も参加者も同じ表示）
          if (schedule.status === 'completed') {
            let finalSchedule = schedule.final_schedule;
            if (typeof finalSchedule === "string") {
              try {
                finalSchedule = JSON.parse(finalSchedule);
              } catch (e) {
                console.error("JSON parse error:", e);
                finalSchedule = [];
              }
            }

            return {
              id: `schedule-final-${schedule.id}`,
              type: "scheduleFinal",
              title: `日程が決まりました！`,
              data: {
                purpose: getMeetupTypeText(schedule.meetup_type),
                finalSchedule: finalSchedule,
                requesterName: schedule.sender_name,
              },
              createdAt: new Date(schedule.created_at),
              isRead: schedule.is_read || false,
              sender: schedule.sender_name,
            };
          }

          // 絞り込まれた候補があればそれを使用、なければ元の候補を使用
          let displayTimeRanges = timeRanges;
          let hasFiltered = false;

          if (schedule.filtered_time_ranges) {
            let filteredRanges = schedule.filtered_time_ranges;
            if (typeof filteredRanges === "string") {
              try {
                filteredRanges = JSON.parse(filteredRanges);
              } catch (e) {
                console.error("JSON parse error:", e);
                filteredRanges = null;
              }
            }

            if (filteredRanges && filteredRanges.length > 0) {
              displayTimeRanges = filteredRanges;
              hasFiltered = true;
            }
          }

          // 通常のスケジュール（回答待ち）
          return {
            id: `schedule-${schedule.id}`,
            type: "meetingRequest",
            title: `${schedule.sender_name}さんから会う提案${hasFiltered ? ' (絞り込み済み)' : ''}`,
            data: {
              purpose: getMeetupTypeText(schedule.meetup_type),
              preferredDates: displayTimeRanges.map((timeRange) => ({
                date: timeRange.date,
                timeSlots: timeRange.ranges.map((range) => ({
                  startTime: range.start || range.startTime,
                  endTime: range.end || range.endTime,
                })),
              })),
              requesterName: schedule.sender_name,
              responseCount: schedule.response_count || 0,
            },
            createdAt: new Date(schedule.created_at),
            isRead: schedule.is_read || false,
            sender: schedule.sender_name,
          };
        });

      // 自分が送ったメッセージを除外
      const messageNotifications = messages
        .filter((message) => String(message.user_id) !== String(currentUserId))
        .map((message) => ({
          id: `message-${message.id}`,
          type: "emotion",
          title: `${message.user_name}さんの今の気持ち`,
          content: `「${message.emotion}」`,
          createdAt: new Date(message.created_at),
          isRead: message.is_read || false,
          data: {
            user_id: message.user_id,
            user_name: message.user_name,
            mood: message.emotion,
            emotion: message.emotion,
            comment: message.comment,
          },
        }));

      const allNotifications = [
        ...scheduleNotifications,
        ...messageNotifications,
      ].sort((a, b) => b.createdAt - a.createdAt);

      const unreadCount = allNotifications.filter((n) => !n.isRead).length;

      const currentState = get();
      const currentIds = new Set(currentState.notifications.map((n) => n.id));
      const newIds = new Set(allNotifications.map((n) => n.id));

      const idsChanged =
        currentIds.size !== newIds.size ||
        [...currentIds].some((id) => !newIds.has(id));
      const unreadCountChanged = currentState.unreadCount !== unreadCount;

      if (idsChanged || unreadCountChanged) {
        set({
          notifications: allNotifications,
          unreadCount: unreadCount,
          loading: false,
        });
      } else {
        set({loading: false});
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      set({loading: false});
    }
  },
}));

export default useNotificationStore;
