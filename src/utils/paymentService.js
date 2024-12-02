// paymentService.js
import axios from 'axios';

const PAYMENT_API_URL = process.env.REACT_APP_PAYMENT_API_URL;

export const initiateKakaoPayment = async (bookingData, totalPrice, spaceId) => {
  try {
    const response = await axios.post(`${PAYMENT_API_URL}/payments/kakao`, {
      space_id: spaceId,
      use_date: bookingData.date,
      start_time: bookingData.startTime,
      end_time: bookingData.endTime
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    // 카카오페이 결제 페이지로 리다이렉트
    if (response.data.next_redirect_pc_url) {
      window.location.href = response.data.next_redirect_pc_url;
    }
    
    return response.data;
  } catch (error) {
    console.error('Payment initiation failed:', error);
    throw error;
  }
};


// PaymentResultHandler.js
export const handlePaymentResult = async (searchParams) => {
  const orderNumber = searchParams.get('order_number');
  const pgToken = searchParams.get('pg_token');
  
  if (orderNumber && pgToken) {
    try {
      const response = await axios.get(`${PAYMENT_API_URL}/payments/kakao/approval`, {
        params: { order_number: orderNumber, pg_token: pgToken },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Payment approval failed:', error);
      throw error;
    }
  }
};