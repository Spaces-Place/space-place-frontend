export const RequirementsInput = ({ bookingData, handleInputChange }) => (
  <div>
    <label className="step1-requirements-label">요청사항</label>
    <textarea
      name="requirements"
      value={bookingData.requirements}
      onChange={handleInputChange}
      className="step1-requirements-textarea"
      rows="3"
    />
  </div>
);