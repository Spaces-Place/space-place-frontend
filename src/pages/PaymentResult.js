// PaymentResult.js
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { handlePaymentResult } from '../utils/paymentService';
import "../styles/booking.css"

// PaymentResult.js
export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('결제 처리중...');

  useEffect(() => {
    const processPayment = async () => {
      const orderNumber = searchParams.get('order_number');
      const pgToken = searchParams.get('pg_token');

      if (orderNumber && pgToken) {
        try {
          const result = await handlePaymentResult(searchParams);
          if (result) {
            setStatus('결제가 완료되었습니다.');
            setTimeout(() => {
              navigate('/booking', {
                state: { paymentSuccess: true }
              });
            }, 1500);
          }
        } catch (error) {
          setStatus('결제 처리 중 오류가 발생했습니다.');
          setTimeout(() => navigate('/booking'), 2000);
        }
      }
    };

    processPayment();
  }, [searchParams, navigate]);

  return (
    <div className="booking_payment-result">
      <h2 className="booking_payment-title">결제 처리 결과</h2>
      <p className="booking_payment-status">{status}</p>
    </div>
  );
}