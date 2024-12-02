export const RequirementsInput = ({ bookingData, handleInputChange }) => (
  <div className="booking_requirements">
    <label className="booking_requirements-label">요청사항</label>
    <textarea
      name="requirements"
      value={bookingData.requirements}
      onChange={handleInputChange}
      placeholder="요청사항을 입력해주세요"
      className="booking_requirements-input"
    />
  </div>
);