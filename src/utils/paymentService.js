// paymentService.js

import axios from 'axios';
import { Cookies } from 'react-cookie';

const PAYMENT_API_URL = process.env.REACT_APP_PYMENTS_API;
const cookies = new Cookies();

const payment_api = axios.create({
  baseURL: PAYMENT_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

if (!PAYMENT_API_URL) {
  console.error('Payment API URL is not defined in environment variables');
}

export const initiateKakaoPayment = async (bookingData, totalPrice, spaceId) => {
  const token = cookies.get('access_token');
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toISOString()
      .replace('T', ' ')
      .split('.')[0];
  };

  const requestData = {
    space_id: spaceId,
    name: bookingData.name,
    phone: bookingData.phone,
    email: bookingData.email,
    ...(bookingData.date 
      ? { use_date: bookingData.date }
      : {
          start_time: formatDateTime(bookingData.start_time),
          end_time: formatDateTime(bookingData.end_time)
        })
  };

  try {
    console.log('Request Data:', {
      ...requestData,
      spaceId_type: typeof spaceId,
      bookingData_contents: bookingData
    });

    const response = await payment_api.post('/kakao', requestData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // window.location.href 직접 설정하지 않고 응답만 반환
    return response.data;
  } catch (error) {
    console.error('Server Error Details:', {
      message: error.message,
      response_data: error.response?.data,
      status: error.response?.status,
      serverMessage: error.response?.data?.message || error.response?.data?.detail,
      requestData: requestData
    });
    throw error;
  }
};

export const checkPaymentStatus = async (tid) => {
  const token = cookies.get('access_token');
  try {
    const response = await payment_api.get(`/kakao/status/${tid}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Payment status check failed:', error);
    throw error;
  }
};

export const handlePaymentResult = async (searchParams) => {
  const orderNumber = searchParams.get('order_number');
  const pgToken = searchParams.get('pg_token');
  const token = cookies.get('access_token');
  
  if (orderNumber && pgToken) {
    try {
      const response = await payment_api.get('/kakao/approval', {
        params: { order_number: orderNumber, pg_token: pgToken },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Payment approval failed:', error.response?.data || error.message);
      throw error;
    }
  }
};