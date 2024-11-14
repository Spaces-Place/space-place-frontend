import { useState } from "react";
import { useLocation } from 'react-router-dom';
import "../styles/booking.css"

// 상수 정의
const CONSTANTS = {
  HOURLY_RATE: 5000,
  MAX_PEOPLE: 10,
  MIN_PEOPLE: 1,
  STEPS: 4,
};

// 초기 상태 정의
const initialBookingData = {
  date: '',
  startTime: '',
  endTime: '',
  numberOfPeople: 1,
  requirements: '',
  name: '',
  phone: '',
  email: '',
  paymentMethod: 'card',
  agreement: false
};

// 결제 수단 매핑
const PAYMENT_METHODS = {
  kakao: '카카오페이머니',
  card: '신용/체크카드',
  transfer: '계좌이체',
  vbank: '가상계좌'
};

// 시간 옵션 생성 유틸리티 함수
const generateTimeOptions = () => 
  Array.from({ length: 24 }, (_, i) => ({
    value: `${i.toString().padStart(2, '0')}:00`,
    label: `${i.toString().padStart(2, '0')}:00`
  }));

// 공통으로 사용되는 인풋 컴포넌트들
const PeopleInput = ({ bookingData, handleInputChange }) => (
  <div>
    <label className="step1-number-label">인원</label>
    <input
      type="number"
      name="numberOfPeople"
      value={bookingData.numberOfPeople}
      onChange={handleInputChange}
      min={CONSTANTS.MIN_PEOPLE}
      max={CONSTANTS.MAX_PEOPLE}
      className="step1-number-input"
    />
  </div>
);

const RequirementsInput = ({ bookingData, handleInputChange }) => (
  <div>
    <label className="step1-requirements-label">요청사항</label>
    <textarea
      name="requirements"
      value={bookingData.requirements}
      onChange={handleInputChange}
      className="step1-requirements-textarea"
      rows="3"
    />
  </div>
);

const TimeSelection = ({ bookingData, handleInputChange, timeOptions }) => (
  <div className="step1-startTime">
    <TimeSelect
      label="시작 시간"
      name="startTime"
      value={bookingData.startTime}
      onChange={handleInputChange}
      options={timeOptions}
    />
    <TimeSelect
      label="종료 시간"
      name="endTime"
      value={bookingData.endTime}
      onChange={handleInputChange}
      options={timeOptions}
    />
  </div>
);

const TimeSelect = ({ label, name, value, onChange, options }) => (
  <div>
    <label className={`step1-${name}-label`}>{label}</label>
    <select 
      name={name}
      value={value}
      onChange={onChange}
      className={`step1-${name}-select`}
    >
      <option value="">선택해주세요</option>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  </div>
);

// Step 컴포넌트들
const BookingStep1 = ({ bookingData, handleInputChange }) => (
  <div className="booking-step">
    <h2 className="step1-text">예약정보입력</h2>
    <div className="space">
      <div>
        <label className="step1-data">날짜</label>
        <input 
          type="date"
          name="date"
          value={bookingData.date}
          onChange={handleInputChange}
          className="step1-input-date"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      <TimeSelection 
        bookingData={bookingData}
        handleInputChange={handleInputChange}
        timeOptions={generateTimeOptions()}
      />
      <PeopleInput 
        bookingData={bookingData}
        handleInputChange={handleInputChange}
      />
      <RequirementsInput 
        bookingData={bookingData}
        handleInputChange={handleInputChange}
      />
    </div>
  </div>
);
  
  // Step 2: 예약자 정보
  const BookingStep2 = ({ bookingData, handleInputChange }) => (
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
  
  // Step 3: 결제 정보
  const BookingStep3 = ({ bookingData, handleInputChange, totalPrice }) => (
    <div className="booking-step">
      <h2 className="step3-info">결제 정보</h2>
      <div className="step3-booking">
        <div className="step3-money">
          <h3 className="step3-money-text">결제 금액</h3>
          <p className="step3-money-detail">
            {bookingData.startTime} - {bookingData.endTime}
          </p>
          <p className="step3-money-small-text">{totalPrice.toLocaleString()}원</p>
        </div>
        <div>
          <label className="step3-paymentMethod-label">결제수단</label>
          <select
            name="paymentMethod"
            value={bookingData.paymentMethod}
            onChange={handleInputChange}
            className="step3-paymentMethod-select"
          >
            {Object.entries(PAYMENT_METHODS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="step3-flexItem">
          <input
            type="checkbox"
            name="agreement"
            checked={bookingData.agreement}
            onChange={handleInputChange}
            className="step3-flexItem-checkbox"
          />
          <label className="step3-text-label">예약 정책에 동의 합니다.</label>
        </div>
      </div>
    </div>
  );
  
  // Step 4: 예약 확인
  const BookingStep4 = ({ bookingData, bookingInfo, totalPrice }) => (
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

// BookingForm 메인 컴포넌트
export default function BookingForm() {
  const location = useLocation();
  const bookingInfo = location.state || {};
  
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState(initialBookingData);
  const [totalPrice, setTotalPrice] = useState(0);

  const calculatePrice = (start, end) => {
    if (!start || !end) return 0;
    const [startHour, endHour] = [start, end].map(time => 
      parseInt(time.split(':')[0]));
    return Math.max(0, endHour - startHour) * CONSTANTS.HOURLY_RATE;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setBookingData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (name === 'startTime' || name === 'endTime') {
      const newPrice = calculatePrice(
        name === 'startTime' ? value : bookingData.startTime,
        name === 'endTime' ? value : bookingData.endTime
      );
      setTotalPrice(newPrice);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < CONSTANTS.STEPS) {
      setStep(prev => prev + 1);
    } else {
      // TODO: API 호출 로직 추가
      alert("예약이 완료되었습니다.");
    }
  };

  const renderStepIndicator = () => (
    <div className="booking-content">
      <div className="booking-date">
        {Array.from({ length: CONSTANTS.STEPS }, (_, i) => i + 1).map((stepNum) => (
          <div
            key={stepNum}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= stepNum ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {stepNum}
          </div>
        ))}
      </div>
      <div className="booking-date-box">
        <div
          className="booking-date-round"
          style={{ width: `${(step / CONSTANTS.STEPS) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <>
    <div className="bookingheader"></div>
      <div className="booking-container">
      {renderStepIndicator()}
      <form onSubmit={handleSubmit}>
        {step === 1 && <BookingStep1 bookingData={bookingData} handleInputChange={handleInputChange} />}
        {step === 2 && <BookingStep2 bookingData={bookingData} handleInputChange={handleInputChange} />}
        {step === 3 && <BookingStep3 bookingData={bookingData} handleInputChange={handleInputChange} totalPrice={totalPrice} />}
        {step === 4 && <BookingStep4 bookingData={bookingData} bookingInfo={bookingInfo} totalPrice={totalPrice} />}
        
        <div className="booking-next-button">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="booking-before"
            >
              이전
            </button>
          )}
          <button type="submit" className="booking-submit">
            {step === CONSTANTS.STEPS ? '결제하기' : '다음'}
          </button>
        </div>
      </form>
    </div>
    </>

  );
}