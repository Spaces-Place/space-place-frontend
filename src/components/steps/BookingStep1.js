import { PeopleInput } from "../PeopleInput";
import {TimeSelection} from "../TimeSelection";
import {RequirementsInput} from "../RequirmentsInput";
import {generateTimeOptions} from "../../utils/timeUtils";
import { useState } from "react";

// Step 컴포넌트들
export const BookingStep1 = ({ bookingData, handleInputChange, spaceType, usageUnit }) => {

  

  return(
  <div className="booking_step">
    <h2 className="booking_step1-text">예약정보입력</h2>
    <div className="booking_space">
    {usageUnit === 'DAY' ? 
        <div>
          <label className="booking_step1-data">날짜</label>
          <input 
            type="date"
            name="use_date"
            value={bookingData.date}
            onChange={handleInputChange}
            className="booking_step1-input-date hide-minutes"
            min={new Date().toISOString().split(' ')[0]}
          />
          </div>
      :(
      <div>
      <label className="booking_step1-data">날짜</label>
      <div className="booking_step1-datetime">
    <div>
      <span>시작</span>
      <input 
        type="datetime-local"
        name="start_time"
        value={bookingData.start_time}
        onChange={(e) => {
          const datetime = e.target.value.split(':')[0] + ':00';
          handleInputChange({
            target: {
              name: 'start_time',
              value: datetime
            }
          });
        }}
        className="booking_step1-input-date hide-minutes"
        min={new Date().toISOString().split(' ')[0]}
        step="3600"
      />
    </div>
    <div>
      <span>종료</span>
      <input 
        type="datetime-local"
        name="end_time"
        value={bookingData.end_time}
        onChange={(e) => {
          const datetime = e.target.value.split(':')[0] + ':00';
          handleInputChange({
            target: {
              name: 'end_time',  
              value: datetime
            }
          });
        }}
        className="booking_step1-input-date hide-minutes"
        min={bookingData.start_time}
        step="3600"
      />
    </div>
  </div>
    </div>
)}
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
  )
};

  export default BookingStep1