export const TimeSelect = ({ label, name, value, onChange, options }) => (
    <div>
      <label className={`step1-${name}-label`}>{label}</label>
      <select 
        name={name}
        value={value}
        onChange={onChange}
        className={`step1-${name}-select`}
      >
        <option value="">선택해주세요</option>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
  

export const TimeSelection = ({ bookingData, handleInputChange, timeOptions }) => (
  <div className="step1-startTime">
    <TimeSelect
      label="시작 시간"
      name="startTime"
      value={bookingData.startTime}
      onChange={handleInputChange}
      options={timeOptions}
    />
    <TimeSelect
      label="종료 시간"
      name="endTime"
      value={bookingData.endTime}
      onChange={handleInputChange}
      options={timeOptions}
    />
  </div>
);