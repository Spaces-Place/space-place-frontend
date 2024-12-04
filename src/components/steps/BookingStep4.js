import { PAYMENT_METHODS } from "../../constants/bookingIndex";
import { useSelector } from 'react-redux';

export const BookingStep4 = () => {
  // Redux store에서 모든 예약 데이터 가져오기
  const { bookingData, bookingInfo, totalPrice } = useSelector(state => state.booking);

  // 시간 포맷팅 함수
  const formatTime = (timeString) => {
    if (!timeString) return '-';
    const date = new Date(timeString);
    return date.toLocaleString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="booking_step">
      <h2 className="booking_step4-text">예약이 완료되었습니다</h2>
      <div className="booking_step4-round">
        <div className="booking_step4-section">
          <h3 className="booking_step4-booking-info">예약 정보</h3>
          <div className="booking_step4-content">
            <p>주문번호: {bookingInfo?.orderNumber || '-'}</p>
            <p>날짜: {bookingData?.date || '-'}</p>
            {bookingData?.start_time && (
              <p>시간: {formatTime(bookingData?.start_time)} ~ {formatTime(bookingData?.end_time)}</p>
            )}
            <p>인원: {bookingData?.numberOfPeople}명</p>
            {bookingData?.requirements && (
              <p>요청사항: {bookingData?.requirements}</p>
            )}
          </div>
        </div>

        <div className="booking_step4-section">
          <h3 className="booking_step4-booking-people">예약자 정보</h3>
          <div className="booking_step4-content">
            <p>이름: {bookingData?.name}</p>
            <p>연락처: {bookingData?.phone}</p>
            <p>이메일: {bookingData?.email}</p>
          </div>
        </div>

        <div className="booking_step4-section">
          <h3 className="booking_step4-booking-payment">결제 정보</h3>
          <div className="booking_step4-content">
            <p>결제 금액: {totalPrice?.toLocaleString()}원</p>
            <p>결제 수단: {PAYMENT_METHODS[bookingData?.paymentMethod]}</p>
            <p>결제 상태: 결제 완료</p>
          </div>
        </div>
      </div>
    </div>
  );
};