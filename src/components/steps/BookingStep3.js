import axios from "axios";
import { PAYMENT_METHODS } from "../../constants/bookingIndex";
import { useState, useEffect } from "react";

const BookingStep3 = ({ bookingData, handleInputChange, totalPrice  }) => {
  const [spaceName, setSpaceName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="booking_step">
      <h2 className="booking_step3-info">결제 정보</h2>
      <div className="booking_step3-booking">
        <div className="booking_step3-money">
          <h3 className="booking_step3-money-text">결제 금액</h3>
          <p className="booking_step3-space-name">{spaceName}</p>
          {bookingData.start_time && bookingData.end_time && (
              <p className="booking_step3-money-detail">
                {new Date(bookingData.start_time).toLocaleString('ko-KR', {
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit'
                })} 
                {' - '}
                {new Date(bookingData.end_time).toLocaleString('ko-KR', {
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit'
                })}
              </p>
          )}
          <p className="booking_step3-money-small-text">
            {totalPrice?.toLocaleString()}원
          </p>
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
};

export default BookingStep3;