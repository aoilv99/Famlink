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
      const scheduleApiUrl = `http://127.0.0.1:3001/api/schedules/${familyId}?${cacheBuster}`;
      const messageApiUrl = `http://127.0.0.1:3001/api/messages/${familyId}?${cacheBuster}`;

      const [scheduleRes, messageRes] = await Promise.all([
        fetch(scheduleApiUrl),
        fetch(messageApiUrl),
      ]);

      if (!scheduleRes.ok || !messageRes.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const schedules = await scheduleRes.json();
      const messages = await messageRes.json();

      console.log(schedules);

      const scheduleNotifications = schedules.map((schedule) => {
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

        return {
          id: `schedule-${schedule.id}`,
          type: "meetingRequest",
          title: `${schedule.sender_name}さんから会う提案`,
          data: {
            purpose: getMeetupTypeText(schedule.meetup_type), // 日本語に変換
            preferredDates: timeRanges.map((timeRange) => ({
              date: timeRange.date,
              timeSlots: timeRange.ranges.map((range) => ({
                startTime: range.start,
                endTime: range.end,
              })),
            })),
            requesterName: schedule.sender_name,
          },
          createdAt: new Date(schedule.created_at),
          isRead: schedule.is_read || false,
          sender: schedule.sender_name,
        };
      });

      const messageNotifications = messages.map((message) => ({
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
