import { PAYMENT_METHODS } from "../../constants/bookingIndex";

// Step 3: 결제 정보
export const BookingStep3 = ({ bookingData, handleInputChange, totalPrice }) => (
  <div className="booking_step">
    <h2 className="booking_step3-info">결제 정보</h2>
    <div className="booking_step3-booking">
      <div className="booking_step3-money">
        <h3 className="booking_step3-money-text">결제 금액</h3>
        <p className="booking_step3-money-detail">
          {bookingData.startTime} - {bookingData.endTime}
        </p>
        <p className="booking_step3-money-small-text">{totalPrice.toLocaleString()}원</p>
      </div>
      <div>
        <label className="booking_step3-paymentMethod-label">결제수단</label>
        <select
          name="paymentMethod"
          value={bookingData.paymentMethod}
          onChange={handleInputChange}
          className="booking_step3-paymentMethod-select"
        >
          {Object.entries(PAYMENT_METHODS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <div className="booking_step3-flexItem">
        <input
          type="checkbox"
          name="agreement"
          checked={bookingData.agreement}
          onChange={handleInputChange}
          className="booking_step3-flexItem-checkbox"
        />
        <label className="booking_step3-text-label">예약 정책에 동의 합니다.</label>
      </div>
    </div>
  </div>
);
