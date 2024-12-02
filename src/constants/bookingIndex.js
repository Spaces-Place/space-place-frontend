

// 상수정의
export const CONSTANTS = {
    HOURLY_RATE: 5000,
    MAX_PEOPLE: 10,
    MIN_PEOPLE: 1,
    STEPS: 4,
  };


//  초기 상태 정의
export const initialBookingData = {
    date: '',
    startTime: '',
    endTime: '',
    numberOfPeople: 1,
    requirements: '',
    name: '',
    phone: '',
    email: '',
    paymentMethod: 'kakao',
    agreement: false
  };


//  결제수단 매핑
export const PAYMENT_METHODS = {
    kakao: '카카오페이머니',
    card: '신용/체크카드',
    transfer: '계좌이체',
    vbank: '가상계좌'
  };