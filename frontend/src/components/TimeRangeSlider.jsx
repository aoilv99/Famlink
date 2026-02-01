import React, { useState } from 'react';
import './TimeRangeSlider.css';

/**
 * 時間帯調整スライダーコンポーネント
 * 開始時間と終了時間をスライダーで調整
 */
const TimeRangeSlider = ({
  originalStart,
  originalEnd,
  onRangeChange,
  disabled = false
}) => {
  // 時間を分に変換
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // 分を時間に変換（HH:MM形式）
  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  const minTime = timeToMinutes(originalStart);
  const maxTime = timeToMinutes(originalEnd);

  const [startMinutes, setStartMinutes] = useState(minTime);
  const [endMinutes, setEndMinutes] = useState(maxTime);

  const handleStartChange = (e) => {
    const value = parseInt(e.target.value);
    // 終了時間より前に設定
    if (value < endMinutes) {
      setStartMinutes(value);
      // 親コンポーネントに変更を通知
      onRangeChange({
        startTime: minutesToTime(value),
        endTime: minutesToTime(endMinutes)
      });
    }
  };

  const handleEndChange = (e) => {
    const value = parseInt(e.target.value);
    // 開始時間より後に設定
    if (value > startMinutes) {
      setEndMinutes(value);
      // 親コンポーネントに変更を通知
      onRangeChange({
        startTime: minutesToTime(startMinutes),
        endTime: minutesToTime(value)
      });
    }
  };

  return (
    <div className="time-range-slider">
      <div className="time-display">
        <span className="time-label">🕐 開始:</span>
        <span className="time-value">{minutesToTime(startMinutes)}</span>
        <span className="time-label">終了:</span>
        <span className="time-value">{minutesToTime(endMinutes)}</span>
      </div>

      <div className="slider-container">
        <input
          type="range"
          min={minTime}
          max={maxTime}
          step={30} // 30分刻み
          value={startMinutes}
          onChange={handleStartChange}
          disabled={disabled}
          className="time-slider start-slider"
        />
        <input
          type="range"
          min={minTime}
          max={maxTime}
          step={30} // 30分刻み
          value={endMinutes}
          onChange={handleEndChange}
          disabled={disabled}
          className="time-slider end-slider"
        />
      </div>

      <div className="slider-labels">
        <span>{originalStart}</span>
        <span>{originalEnd}</span>
      </div>
    </div>
  );
};

export default TimeRangeSlider;
