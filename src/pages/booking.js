// BookingForm.js
import { useState, useEffect  } from "react";
import { useLocation } from 'react-router-dom';
import { calculatePrice } from '../utils/timeUtils';
import { CONSTANTS, initialBookingData } from '../constants/bookingIndex';
import { RenderStepIndicator } from '../components/RenderStepIndicator';
import { BookingStep1 } from '../components/steps/BookingStep1';
import { BookingStep2 } from '../components/steps/BookingStep2';
import { BookingStep3 } from '../components/steps/BookingStep3';
import { BookingStep4 } from '../components/steps/BookingStep4';
import { handlePayment, initiateKakaoPayment  } from '../utils/paymentService';

export default function BookingForm() {
  const location = useLocation();
  const bookingInfo = location.state || {};
      
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState(initialBookingData);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentProcessing, setPaymentProcessing] = useState(false);  

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step < 3) { // 1,2단계는 그냥 다음으로
      setStep(prev => prev + 1);
    } 
    else if (step === 3) { // 3단계에서 결제 처리
      if (!bookingData.agreement) {
        alert('예약 정책에 동의해주세요.');
        return;
      }
 
      try {
        setPaymentProcessing(true);
        if (bookingData.paymentMethod === 'kakao') {
          const response = await initiateKakaoPayment(bookingData, totalPrice, bookingInfo.spaceId);
          // 카카오페이 결제창으로 바로 이동
          if (response.next_redirect_pc_url) {
            window.location.href = response.next_redirect_pc_url;
          }
        } else {
          alert('현재 카카오페이만 지원됩니다.');
        }
      } catch (error) {
        alert('결제 처리 중 오류가 발생했습니다.');
        console.error('Payment error:', error);
      } finally {
        setPaymentProcessing(false);
      }
    }
  };

  useEffect(() => {
    const paymentSuccess = location.state?.paymentSuccess;
    if (paymentSuccess) {
      setStep(4);
    }
  }, [location]);
 
  return (
    <div className="booking_container">
      <RenderStepIndicator currentStep={step} totalStep={CONSTANTS.STEPS} />
      <form onSubmit={handleSubmit}>
        {step === 1 && <BookingStep1 bookingData={bookingData} handleInputChange={handleInputChange} />}
        {step === 2 && <BookingStep2 bookingData={bookingData} handleInputChange={handleInputChange} />}
        {step === 3 && <BookingStep3 bookingData={bookingData} handleInputChange={handleInputChange} totalPrice={totalPrice} />}
        {step === 4 && <BookingStep4 bookingData={bookingData} bookingInfo={bookingInfo} totalPrice={totalPrice} />}
        
        <div className="booking_next-button">
          {step > 1 && step < 4 && (
            <button 
              type="button" 
              onClick={() => setStep(prev => prev - 1)} 
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