// PaymentApproval.js
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentApproval = () => {
  useEffect(() => {
    // 부모 창으로 메시지 전송
    if (window.opener) {
      window.opener.postMessage(
        {
          type: 'KAKAO_PAYMENT_SUCCESS',
          url: window.location.href
        },
        '*'
      );
      // 팝업 창 닫기
      window.close();
    }
  }, []);

  return (
    <div className="payment-approval">
      <h2>결제 승인 중...</h2>
      <p>잠시만 기다려주세요.</p>
    </div>
  );
};

export default PaymentApproval;