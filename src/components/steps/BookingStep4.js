import { PAYMENT_METHODS } from "../../constants/bookingIndex";
import { useSelector } from 'react-redux';

export const BookingStep4 = () => {
  // Redux store에서 데이터 가져오기
  const { bookingData, bookingInfo, totalPrice } = useSelector(state => state.booking);

  // 시간 포맷팅 함수
  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return new Date(timeString).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // 디버깅용 콘솔 로그
  console.log('step4 bookingData : ', bookingData);
  console.log('step4 bookingInfo : ', bookingInfo);
  console.log('step4 totalPrice : ', totalPrice);

  return (
    <div className="booking_step">
      <h2 className="booking_step4-text">예약 확인</h2>
      <div className="booking_step4-round">
        <div>
          <h3 className="booking_step4-booking-info">예약정보</h3>
          <p>공간: {bookingInfo?.title}</p>
          <p>날짜: {bookingData?.date}</p>
          <p>시간: {formatTime(bookingData?.start_time)} ~ {formatTime(bookingData?.end_time)}</p>
          <p>인원: {bookingData?.numberOfPeople}명</p>
          {bookingData?.requirements && (
            <p>요청사항: {bookingData.requirements}</p>
          )}
        </div>
        <div>
          <h3 className="booking_step4-booking-people">예약자 정보</h3>
          <p>이름: {bookingData?.name}</p>
          <p>연락처: {bookingData?.phone}</p>
          <p>이메일: {bookingData?.email}</p>
        </div>
        <div>
          <h3 className="booking_step4-booking-payment">결제 정보</h3>
          <p>결제 금액: {totalPrice?.toLocaleString()}원</p>
          <p>결제 수단: {PAYMENT_METHODS[bookingData?.paymentMethod]}</p>
        </div>
      </div>
    </div>
  );
};