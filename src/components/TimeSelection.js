// import DateTimeField from "react-bootstrap-datetimepicker"


  export const TimeSelection = ({ bookingData, handleInputChange, timeOptions }) => (
    <div className="booking_time-selection">
      <label className="booking_time-label">시작 시간</label>
      <select
        name="startTime"
        value={bookingData.startTime}
        onChange={handleInputChange}
        className="booking_time-select"
      >
        <option value="">선택해주세요</option>
        {timeOptions.map(time => (
          <option key={time.value} value={time.value}>
            {time.label}
          </option>
        ))}
      </select>
      
      <label className="booking_time-label">종료 시간</label>
      {/* <DateTimeField /> */}
      <select
        name="endTime"
        value={bookingData.endTime}
        onChange={handleInputChange}
        className="booking_time-select"
      >
        <option value="">선택해주세요</option>
        {timeOptions.map(time => (
          <option key={time.value} value={time.value}>
            {time.label}
          </option>
        ))}
      </select>
    </div>
  );