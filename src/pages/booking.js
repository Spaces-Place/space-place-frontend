// BookingForm.js
import { useState, useEffect  } from "react";
import { useLocation } from 'react-router-dom';
import { calculatePrice } from '../utils/timeUtils';
import { CONSTANTS, initialBookingData } from '../constants/bookingIndex';
import { RenderStepIndicator } from '../components/RenderStepIndicator';
import { BookingStep1 } from '../components/steps/BookingStep1';
import { BookingStep2 } from '../components/steps/BookingStep2';
import BookingStep3 from '../components/steps/BookingStep3';
import { BookingStep4 } from '../components/steps/BookingStep4';
import { initiateKakaoPayment } from '../utils/paymentService';
import "../styles/booking.css";

export default function BookingForm() {
  const location = useLocation();
  const bookingInfo = location.state || {};
  const usageUnit = bookingInfo.usageUnit;

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

    if (name === 'start_time' || name === 'end_time') {
      const newPrice = calculatePrice(
        name === 'start_time' ? value : bookingData.start_time,
        name === 'end_time' ? value : bookingData.end_time
      );
      setTotalPrice(newPrice);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(prev => prev + 1);
    } 
    else if (step === 3) {
      if (!bookingData.agreement) {
        alert('예약 정책에 동의해주세요.');
        return;
      }
  
      try {
        setPaymentProcessing(true);
        if (bookingData.paymentMethod === 'kakao') {
          const paymentData = {
            user_name: bookingData.name,
            phone: bookingData.phone,
            email: bookingData.email,
            ...(usageUnit === 'DAY' 
              ? { date: bookingData.date }
              : { 
                  start_time: bookingData.start_time,
                  end_time: bookingData.end_time
                }
            )
          };
  
          const response = await initiateKakaoPayment(
            paymentData,
            totalPrice,
            bookingInfo.spaceId
          );
  
          if (response.next_redirect_pc_url) {
            // 현재의 bookingData를 세션 스토리지에 저장
            sessionStorage.setItem('currentBookingData', JSON.stringify({
              bookingData,
              bookingInfo,
              totalPrice
            }));
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


 // 결제 성공 후 상태 처리
 useEffect(() => {
  if (location.state?.paymentSuccess) {
    setStep(4);
    // 결제 성공 후의 예약 데이터로 업데이트
    if (location.state.bookingDetails) {
      setBookingData(prev => ({
        ...prev,
        ...location.state.bookingDetails
      }));
    }
  }
}, [location.state]);

 
return (
  <div className="booking_container">
    <RenderStepIndicator currentStep={step} totalStep={CONSTANTS.STEPS} />
    <form onSubmit={handleSubmit}>
      {step === 1 && (
        <BookingStep1
          bookingData={bookingData}
          handleInputChange={handleInputChange}
          usageUnit={usageUnit}
        />
      )}
      {step === 2 && (
        <BookingStep2 
          bookingData={bookingData} 
          handleInputChange={handleInputChange} 
        />
      )}
      {step === 3 && (
        <BookingStep3 
          bookingData={bookingData} 
          handleInputChange={handleInputChange}
          totalPrice={totalPrice}
          price={bookingInfo.price}
          spaceName={bookingInfo.title}
        />
      )}
      {step === 4 && (
        <BookingStep4 
          bookingData={bookingData}
          bookingInfo={bookingInfo}
          price={totalPrice || bookingInfo.price}
        />
      )}
      
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
