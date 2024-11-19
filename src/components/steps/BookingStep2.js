import { PAYMENT_METHODS } from "../../constants/bookingIndex";

// Step 2: 예약자 정보
export const BookingStep2 = ({ bookingData, handleInputChange }) => (
    <div className="booking-step">
      <h2 className="step2-info">예약자 정보</h2>
      <div className="step2-box">
        <div>
          <label className="step2-name-label">이름</label>
          <input
            type="text"
            name="name"
            value={bookingData.name}
            onChange={handleInputChange}
            className="step2-name-input"
          />
        </div>
        <div>
          <label className="step2-phone-label">연락처</label>
          <input
            type="tel"
            name="phone"
            value={bookingData.phone}
            onChange={handleInputChange}
            className="step2-phone-input"
          />
        </div>
        <div>
          <label className="step2-email-label">이메일</label>
          <input
            type="email"
            name="email"
            value={bookingData.email}
            onChange={handleInputChange}
            className="step2-email-input"
          />
        </div>
      </div>
    </div>
  );