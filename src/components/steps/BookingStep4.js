import { PAYMENT_METHODS } from "../../constants/bookingIndex";

export const BookingStep4 = ({ bookingInfo }) => {
  const { bookingData, bookingInfo: spaceInfo } = bookingInfo;

  // 날짜와 시간 분리 포맷팅
  const formatDateTime = (timeString) => {
    const date = new Date(timeString);
    return {
      date: date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    };
  };

  // 총 금액 계산
  const calculateTotalPrice = () => {
    const start = new Date(bookingData.start_time);
    const end = new Date(bookingData.end_time);
    const diffHours = (end - start) / (1000 * 60 * 60);
    const basePrice = parseInt(spaceInfo.price.replace(/[^0-9]/g, ''));
    return diffHours * basePrice;
  };

  const startDateTime = formatDateTime(bookingData.start_time);
  const endDateTime = formatDateTime(bookingData.end_time);
  const totalPrice = calculateTotalPrice();

  return (
    <div className="booking_step">
      <h2 className="booking_step4-text">예약 확인</h2>
      <div className="booking_step4-round">
        <div>
          <h3 className="booking_step4-booking-info">예약정보</h3>
          <p>공간: {spaceInfo.name}</p>
          <p>날짜: {startDateTime.date}</p>
          <p>시간: {startDateTime.time} ~ {endDateTime.time}</p>
          <p>인원: {bookingData.numberOfPeople}명</p>
          {bookingData.requirements && (
            <p>요청사항: {bookingData.requirements}</p>
          )}
        </div>
        <div>
          <h3 className="booking_step4-booking-people">예약자 정보</h3>
          <p>이름: {bookingData.name}</p>
          <p>연락처: {bookingData.phone}</p>
          <p>이메일: {bookingData.email}</p>
        </div>
        <div>
          <h3 className="booking_step4-booking-payment">결제 정보</h3>
          <p>결제 금액: {totalPrice.toLocaleString()}원</p>
          <p>시간당 금액: {spaceInfo.price}</p>
          <p>결제 수단: {PAYMENT_METHODS[bookingData.paymentMethod]}</p>
        </div>
      </div>
    </div>
  );
};