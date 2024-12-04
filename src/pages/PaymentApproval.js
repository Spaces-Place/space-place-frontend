// PaymentApproval.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentApproval = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.opener) {
      const currentUrl = `${window.location.origin}/api/v1/payments${location.pathname}${location.search}`;
      window.opener.postMessage(
        {
          type: 'KAKAO_PAYMENT_SUCCESS',
          url: currentUrl
        },
        window.location.origin
      );
      window.close();
    }
  }, [location]);

  return (
    <div className="payment-approval">
      <h2>결제 승인 중...</h2>
      <p>잠시만 기다려주세요.</p>
    </div>
  );
};

export default PaymentApproval;