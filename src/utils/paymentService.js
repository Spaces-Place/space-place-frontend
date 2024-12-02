import axios from 'axios';
import { Cookies } from 'react-cookie';

const PAYMENT_API_URL = process.env.REACT_APP_PYMENTS_API;
const cookies = new Cookies();

// payment API 전용 인스턴스 생성
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

  try {
    // 요청 데이터 구성
    const requestData = {
      space_id: spaceId,
      use_date: bookingData.date,
      start_time: bookingData.startTime,
      end_time: bookingData.endTime
    };

    // 데이터 유효성 사전 체크
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

    if (response.data.next_redirect_pc_url) {
      window.location.href = response.data.next_redirect_pc_url;
    }
    
    return response.data;
  }  catch (error) {
    console.error('Server Error Details:', {
      message: error.message,
      response_data: error.response?.data,
      status: error.response?.status,
      serverMessage: error.response?.data?.message || error.response?.data?.detail,
      requestData: {
        space_id: spaceId,
        use_date: bookingData.date,
        start_time: bookingData.startTime,
        end_time: bookingData.endTime
      }
    });
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