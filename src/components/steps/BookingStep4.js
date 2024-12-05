import { PAYMENT_METHODS } from "../../constants/bookingIndex";

export const BookingStep4 = ({ bookingData, bookingInfo, price }) => {
  // 시간 포맷팅 함수
  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const { spaceInfo, reservationInfo } = bookingData || {};

  return (
    <div className="booking_step">
      <h2 className="booking_step4-text">예약 확인</h2>
      <div className="booking_step4-round">
        <div>
          <h3 className="booking_step4-booking-info">예약정보</h3>
          <p>공간: {spaceInfo?.title}</p>
          {reservationInfo?.date ? (
            <p>날짜: {reservationInfo.date}</p>
          ) : (
            <p>시간: {formatTime(reservationInfo?.start_time)} ~ {formatTime(reservationInfo?.end_time)}</p>
          )}
          <p>인원: {reservationInfo?.numberOfPeople}명</p>
          {reservationInfo?.requirements && (
            <p>요청사항: {reservationInfo.requirements}</p>
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
          <p>결제 금액: {price?.toLocaleString()}원</p>
          <p>결제 수단: {PAYMENT_METHODS[reservationInfo?.paymentMethod]}</p>
        </div>
      </div>
    </div>
  );
};