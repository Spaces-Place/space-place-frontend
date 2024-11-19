import { CONSTANTS } from '../constants/bookingIndex';

// 공통으로 사용되는 인풋 컴포넌트들
export const PeopleInput = ({ bookingData, handleInputChange }) => (
    <div>
      <label className="step1-number-label">인원</label>
      <input
        type="number"
        name="numberOfPeople"
        value={bookingData.numberOfPeople}
        onChange={handleInputChange}
        min={CONSTANTS.MIN_PEOPLE}
        max={CONSTANTS.MAX_PEOPLE}
        className="step1-number-input"
      />
    </div>
  );
  