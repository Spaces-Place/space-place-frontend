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
import { handlePayment, initiateKakaoPayment, handlePaymentApproval  } from '../utils/paymentService';

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

// BookingForm.js
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
          // 카카오페이 결제창 팝업으로 열기
          const width = 450;
          const height = 650;
          const left = window.screen.width / 2 - width / 2;
          const top = window.screen.height / 2 - height / 2;

          // 결제 완료 후 처리를 위한 메시지 리스너
          const handleMessage = async (e) => {
            if (e.data.type === 'KAKAO_PAYMENT_SUCCESS') {
              const approvalUrl = e.data.url;
              const urlParams = new URLSearchParams(new URL(approvalUrl).search);
              const orderNumber = urlParams.get('order_number');
              const pgToken = urlParams.get('pg_token');
              
              const result = await handlePaymentApproval(orderNumber, pgToken);
              if (result.success) {
                setStep(4); // 결제 성공 시 step 4로 이동
              }
            }
          };

          window.addEventListener('message', handleMessage);
          
          const popup = window.open(
            response.next_redirect_pc_url,
            'KakaoPay',
            `width=${width},height=${height},left=${left},top=${top}`
          );

          // 팝업 닫힘 감지
          const checkPopupClosed = setInterval(() => {
            if (popup.closed) {
              clearInterval(checkPopupClosed);
              window.removeEventListener('message', handleMessage);
              setPaymentProcessing(false);
            }
          }, 500);
        }
      }
    } catch (error) {
      alert('결제 처리 중 오류가 발생했습니다.');
      console.error('Payment error:', error);
      setPaymentProcessing(false);
    }
  }
};



  // 결제 상태 확인 함수
  const checkPaymentStatus = async (tid) => {
    try {
      const response = await fetch(`/api/payments/status/${tid}`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Payment status check failed');
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
        {step === 1 && 
        (<BookingStep1
          bookingData={bookingData}
          handleInputChange={handleInputChange}
          usageUnit={usageUnit}
         />)}
        {step === 2 && <BookingStep2 bookingData={bookingData} handleInputChange={handleInputChange} />}
        {step === 3 && <BookingStep3 bookingData={bookingData} handleInputChange={handleInputChange} totalPrice={totalPrice} price={bookingInfo.price} spaceName={bookingData.name} />}
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