import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { calculatePrice } from '../utils/timeUtils';
import { CONSTANTS, initialBookingData } from '../constants/bookingIndex';
import { RenderStepIndicator } from '../components/RenderStepIndicator';
import { BookingStep1 } from '../components/steps/BookingStep1';
import { BookingStep2 } from '../components/steps/BookingStep2';
import BookingStep3 from '../components/steps/BookingStep3';
import { BookingStep4 } from '../components/steps/BookingStep4';
import { initiateKakaoPayment } from '../utils/paymentService';
import { useSelector, useDispatch } from 'react-redux';
import { saveBookingData, updateBookingData, setBookingInfo, setTotalPrice, setStep } from '../store/bookingSlice';
import "../styles/booking.css";

export default function BookingForm() {
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { step, bookingData, bookingInfo, totalPrice, usageUnit } = useSelector(state => state.booking);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // location.state에서 받은 bookingInfo를 Redux store에 저장
  useEffect(() => {
    if (location.state) {
      dispatch(setBookingInfo(location.state));
    }
  }, [location.state, dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    dispatch(updateBookingData({ name, value: newValue }));

    if (name === 'start_time' || name === 'end_time') {
      const newPrice = calculatePrice(
        name === 'start_time' ? value : bookingData.start_time,
        name === 'end_time' ? value : bookingData.end_time
      );
      dispatch(setTotalPrice(newPrice));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step < 3) {
      dispatch(setStep(step + 1));
      dispatch(saveBookingData({
        bookingData,
        bookingInfo,
        totalPrice,
        usageUnit
      }));
    } 
    else if (step === 3) {
      if (!bookingData.agreement) {
        alert('예약 정책에 동의해주세요.');
        return;
      }
  
      try {
        setPaymentProcessing(true);
        if (bookingData.paymentMethod === 'kakao') {
          const paymentData = usageUnit === 'DAY' 
            ? {
                date: bookingData.date,
                user_name: bookingData.name,
                phone: bookingData.phone,
                email: bookingData.email
              }
            : {
                start_time: bookingData.start_time,
                end_time: bookingData.end_time,
                user_name: bookingData.name,
                phone: bookingData.phone,
                email: bookingData.email
              };
  
          const response = await initiateKakaoPayment(
            paymentData,
            totalPrice,
            bookingInfo.spaceId
          );
  
          if (response.next_redirect_pc_url) {
            window.location.href = response.next_redirect_pc_url;
          }
        }
      } catch (error) {
        alert('결제 처리 중 오류가 발생했습니다.');
        console.error('Payment error:', error);
        setPaymentProcessing(false);
      }
    }
  };

  useEffect(() => {
    if (location.state?.paymentSuccess) {
      dispatch(setStep(4));
    }
  }, [location, dispatch]);
 
  return (
    <div className="booking_container">
      <RenderStepIndicator currentStep={step} totalStep={CONSTANTS.STEPS} />
      <form onSubmit={handleSubmit}>
        {step === 1 && 
        (<BookingStep1
          bookingData={bookingData}
          handleInputChange={handleInputChange}
          usageUnit={usageUnit}
         />)}
        {step === 2 && <BookingStep2 bookingData={bookingData} handleInputChange={handleInputChange} />}
        {step === 3 && <BookingStep3 bookingData={bookingData} handleInputChange={handleInputChange} totalPrice={totalPrice} price={bookingInfo?.price} spaceName={bookingData.name} />}
        {step === 4 && <BookingStep4 bookingData={bookingData} bookingInfo={bookingInfo} totalPrice={totalPrice} />}
        
        <div className="booking_next-button">
          {step > 1 && step < 4 && (
            <button 
              type="button" 
              onClick={() => dispatch(setStep(step - 1))}
              className="booking_before"
              disabled={paymentProcessing}
            >
              이전
            </button>
          )}
          <button 
            type="submit" 
            className="booking_submit"
            disabled={paymentProcessing}
          >
            {step === 3 ? '결제하기' : (step === 4 ? '완료' : '다음')}
          </button>
        </div>
      </form>
    </div>
  );
}