import { PeopleInput } from "../PeopleInput";
import {TimeSelection} from "../TimeSelection";
import {RequirementsInput} from "../RequirmentsInput";
import {generateTimeOptions} from "../../utils/timeUtils";

// Step 컴포넌트들
export const BookingStep1 = ({ bookingData, handleInputChange }) => (
    <div className="booking-step">
      <h2 className="step1-text">예약정보입력</h2>
      <div className="space">
        <div>
          <label className="step1-data">날짜</label>
          <input 
            type="date"
            name="date"
            value={bookingData.date}
            onChange={handleInputChange}
            className="step1-input-date"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <TimeSelection 
          bookingData={bookingData}
          handleInputChange={handleInputChange}
          timeOptions={generateTimeOptions()}
        />
        <PeopleInput 
          bookingData={bookingData}
          handleInputChange={handleInputChange}
        />
        <RequirementsInput 
          bookingData={bookingData}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  );


  export default BookingStep1