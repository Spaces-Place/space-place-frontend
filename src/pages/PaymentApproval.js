// PaymentApproval.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentApproval = () => {
  const location = useLocation();

  useEffect(() => {
    // 부모 창이 존재하는 경우에만 실행
    if (window.opener) {
      // 메시지 전송
      window.opener.postMessage(
        {
          type: 'KAKAO_PAYMENT_SUCCESS',
          url: window.location.href
        },
        '*'
      );
      
      // 잠시 후 창 닫기 (메시지가 확실히 전달되도록)
      setTimeout(() => {
        window.close();
      }, 500);
    }
  }, []);

  return (
    <div className="payment-approval">
      <h2>결제가 완료되었습니다</h2>
      <p>곧 창이 자동으로 닫힙니다.</p>
    </div>
  );
};

export default PaymentApproval;