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


  
  export const handlePaymentResult = async (searchParams) => {
    const orderNumber = searchParams.get('order_number');
    const pgToken = searchParams.get('pg_token');
    const token = cookies.get('access_token');
    
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }
  
    if (!orderNumber || !pgToken) {
      throw new Error('결제 정보가 올바르지 않습니다.');
    }
  
    try {
      const response = await payment_api.get('/kakao/approval', {
        params: { 
          order_number: orderNumber, 
          pg_token: pgToken 
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        // 타임아웃 설정
        timeout: 10000,
        // 재시도 설정
        retry: 3,
        retryDelay: 1000
      });
      
      if (response.data) {
        return response.data;
      } else {
        throw new Error('결제 승인 응답이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('Payment result handling failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
  
      // 에러 응답 구체화
      if (error.response) {
        // 서버에서 응답이 왔지만 에러인 경우
        if (error.response.status === 401) {
          throw new Error('로그인이 필요합니다.');
        } else if (error.response.status === 400) {
          throw new Error(error.response.data.detail || '잘못된 결제 요청입니다.');
        } else if (error.response.status === 500) {
          throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        throw new Error('서버 응답이 없습니다. 네트워크 연결을 확인해주세요.');
      }
      
      // 기타 에러
      throw new Error('결제 처리 중 오류가 발생했습니다.');
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