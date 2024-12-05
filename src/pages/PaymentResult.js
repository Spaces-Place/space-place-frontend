import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { handlePaymentResult } from '../utils/paymentService';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('결제 처리중...');
  const [isError, setIsError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const handleRetry = () => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      setStatus('재시도 중...');
      processPayment();
    } else {
      setStatus('최대 재시도 횟수를 초과했습니다.');
      setTimeout(() => navigate('/booking'), 2000);
    }
  };

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
        setTimeout(() => {
          navigate('/booking', {
            state: { 
              paymentSuccess: true,
              orderNumber: orderNumber,
              bookingDetails: result.bookingDetails || {},
              spaceId: result.spaceId,
              spaceName: result.spaceName,
              price: result.price
            }
          });
        }, 1500);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setIsError(true);
      
      if (error.response?.status === 500) {
        setStatus('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else if (error.response?.status === 400) {
        setStatus('잘못된 결제 요청입니다.');
      } else if (error.response?.status === 401) {
        setStatus('로그인이 필요합니다.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      } else {
        setStatus('결제 처리 중 오류가 발생했습니다.');
      }

      if (retryCount < MAX_RETRIES) {
        setTimeout(handleRetry, 2000);
      } else {
        setTimeout(() => navigate('/booking'), 3000);
      }
    }
  };

  useEffect(() => {
    processPayment();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="booking_payment-result">
      <div className="booking_payment-container">
        <h2 className="booking_payment-title">결제 처리 결과</h2>
        
        <div className="booking_payment-content">
          <p className={`booking_payment-status ${isError ? 'error' : ''}`}>
            {status}
          </p>
          {isError && retryCount < MAX_RETRIES && (
            <p className="booking_payment-retry">
              자동으로 재시도 중입니다... ({retryCount}/{MAX_RETRIES})
            </p>
          )}
        </div>

        {isError && retryCount >= MAX_RETRIES && (
          <div className="booking_payment-actions">
            <button
              onClick={() => navigate('/booking')}
              className="booking_payment-button"
            >
              예약 페이지로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;