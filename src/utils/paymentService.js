import axios from 'axios';

const PAYMENT_API_URL = process.env.REACT_APP_PYMENTS_API;

if (!PAYMENT_API_URL) {
 console.error('Payment API URL is not defined in environment variables');
}

export const initiateKakaoPayment = async (bookingData, totalPrice, spaceId) => {
  // API URL 확인을 위한 로깅 추가
  const url = `${process.env.REACT_APP_PYMENTS_API}/kakao`;
  console.log('Payment API URL:', url);
  
  try {
    const response = await axios.post(url, {
      space_id: spaceId,
      use_date: bookingData.date,
      start_time: bookingData.startTime,
      end_time: bookingData.endTime
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      // CORS 이슈 디버깅을 위한 설정
      withCredentials: true
    });

    if (response.data.next_redirect_pc_url) {
      window.location.href = response.data.next_redirect_pc_url;
    }
    
    return response.data;
  } catch (error) {
    // 자세한 에러 정보 로깅
    console.error('Payment Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw error;
  }
};

export const handlePaymentResult = async (searchParams) => {
 const orderNumber = searchParams.get('order_number');
 const pgToken = searchParams.get('pg_token');
 
 if (orderNumber && pgToken) {
   try {
     const response = await axios.get(`${PAYMENT_API_URL}/kakao/approval`, {
       params: { order_number: orderNumber, pg_token: pgToken },
       headers: {
         'Authorization': `Bearer ${localStorage.getItem('token')}`,
         'Content-Type': 'application/json'
       }
     });
     
     return response.data;
   } catch (error) {
     console.error('Payment approval failed:', error.response?.data || error.message);
     throw error;
   }
 }
};