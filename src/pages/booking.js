import { useState } from "react";
import { useLocation } from 'react-router-dom';
import "../styles/booking.css"
import {calculatePrice} from '../utils/timeUtils';
import { CONSTANTS, initialBookingData } from '../constants/bookingIndex';
import { RenderStepIndicator } from '../components/RenderStepIndicator';
import { BookingStep1 } from '../components/steps/BookingStep1';
import { BookingStep2 } from '../components/steps/BookingStep2';
import { BookingStep3 } from '../components/steps/BookingStep3';
import { BookingStep4 } from '../components/steps/BookingStep4';



// BookingForm 메인 컴포넌트
export default function BookingForm() {
  const location = useLocation();
  const bookingInfo = location.state || {};
  
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState(initialBookingData);
  const [totalPrice, setTotalPrice] = useState(0);



  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setBookingData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (name === 'startTime' || name === 'endTime') {
      const newPrice = calculatePrice(
        name === 'startTime' ? value : bookingData.startTime,
        name === 'endTime' ? value : bookingData.endTime
      );
      setTotalPrice(newPrice);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < CONSTANTS.STEPS) {
      setStep(prev => prev + 1);
    } else {
      // TODO: API 호출 로직 추가
      alert("예약이 완료되었습니다.");
    }
  };


  return (
    <>
    <div className="bookingheader"></div>
      <div className="booking-container">
      <RenderStepIndicator currentStep={step} totalStep={CONSTANTS.STEPS} />
      <form onSubmit={handleSubmit}>
        {step === 1 && <BookingStep1 bookingData={bookingData} handleInputChange={handleInputChange} />}
        {step === 2 && <BookingStep2 bookingData={bookingData} handleInputChange={handleInputChange} />}
        {step === 3 && <BookingStep3 bookingData={bookingData} handleInputChange={handleInputChange} totalPrice={totalPrice} />}
        {step === 4 && <BookingStep4 bookingData={bookingData} bookingInfo={bookingInfo} totalPrice={totalPrice} />}
        
        <div className="booking-next-button">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="booking-before"
            >
              이전
            </button>
          )}
          <button type="submit" className="booking-submit">
            {step === CONSTANTS.STEPS ? '결제하기' : '다음'}
          </button>
        </div>
      </form>
    </div>
    </>

  );
}