-- スケジュールテーブルに共通時間帯カラムを追加

-- common_slotsカラムを追加（共通する時間帯を保存）
ALTER TABLE schedules
ADD COLUMN common_slots JSON DEFAULT NULL COMMENT '全員の共通時間帯（複数ある場合）';

-- statusカラムの値を更新（必要に応じて）
-- 既存のステータス: pending, completed
-- 新規ステータス: auto_decided, pending_selection, no_common_time
