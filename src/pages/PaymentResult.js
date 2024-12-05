// PaymentResult.js
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { handlePaymentResult } from '../utils/paymentService';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('결제 처리중...');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const processPayment = async () => {
      const orderNumber = searchParams.get('order_number');
      const pgToken = searchParams.get('pg_token');

      if (!orderNumber || !pgToken) {
        setStatus('결제 정보가 올바르지 않습니다.');
        setIsError(true);
        setTimeout(() => navigate('/booking'), 2000);
        return;
      }

      try {
        const result = await handlePaymentResult(searchParams);
        if (result) {
          setStatus('결제가 성공적으로 완료되었습니다.');
          
          // 세션 스토리지에서 예약 데이터 가져오기
          const savedBookingData = JSON.parse(sessionStorage.getItem('currentBookingData') || '{}');
          
          setTimeout(() => {
            navigate('/booking', {
              state: {
                paymentSuccess: true,
                orderNumber,
                bookingDetails: savedBookingData.bookingData,
                bookingInfo: savedBookingData.bookingInfo,
                price: savedBookingData.totalPrice,
                ...result
              }
            });
            // 세션 스토리지 클리어
            sessionStorage.removeItem('currentBookingData');
          }, 1500);
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        setIsError(true);
        setStatus('결제 처리 중 오류가 발생했습니다.');
        setTimeout(() => navigate('/booking'), 2000);
      }
    };

    processPayment();
  }, [searchParams, navigate]);

  return (
    <div className="booking_payment-result">
      <div className="booking_payment-container">
        <h2 className="booking_payment-title">결제 처리 결과</h2>
        <div className="booking_payment-content">
          <p className={`booking_payment-status ${isError ? 'error' : ''}`}>
            {status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;