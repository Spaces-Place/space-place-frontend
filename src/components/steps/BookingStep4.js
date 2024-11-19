import { PAYMENT_METHODS } from "../../constants/bookingIndex";

// Step 4: 예약 확인
export const BookingStep4 = ({ bookingData, bookingInfo, totalPrice }) => (
    <div className="booking-step">
      <h2 className="step4-text">예약 확인</h2>
      <div className="step4-round">
        <div>
          <h3 className="step4-booking-info">예약정보</h3>
          <p>공간: {bookingInfo.title}</p>
          <p>날짜: {bookingData.date}</p>
          <p>시간: {bookingData.startTime} ~ {bookingData.endTime}</p>
          <p>인원: {bookingData.numberOfPeople}명</p>
          {bookingData.requirements && (
            <p>요청사항: {bookingData.requirements}</p>
          )}
        </div>
        <div>
          <h3 className="step4-booking-people">예약자 정보</h3>
          <p>이름: {bookingData.name}</p>
          <p>연락처: {bookingData.phone}</p>
          <p>이메일: {bookingData.email}</p>
        </div>
        <div>
          <h3 className="step4-booking-payment">결제 정보</h3>
          <p>결제 금액: {totalPrice.toLocaleString()}원</p>
          <p>결제 수단: {PAYMENT_METHODS[bookingData.paymentMethod]}</p>
        </div>
      </div>
    </div>
  );