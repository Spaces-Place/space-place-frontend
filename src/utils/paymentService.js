import axios from 'axios';

const PAYMENT_API_URL = process.env.REACT_APP_PYMENTS_API;

if (!PAYMENT_API_URL) {
 console.error('Payment API URL is not defined in environment variables');
}

export const initiateKakaoPayment = async (bookingData, totalPrice, spaceId) => {
 try {
   const response = await axios.post(`${PAYMENT_API_URL}/kakao`, {
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

   if (response.data.next_redirect_pc_url) {
     window.location.href = response.data.next_redirect_pc_url;
   }
   
   return response.data;
 } catch (error) {
   console.error('Payment initiation failed:', error.response?.data || error.message);
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