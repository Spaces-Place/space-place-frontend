// authService.js
import axios from 'axios';

const API_URL = 'http://43.203.124.105/members';

const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };
  
  const login = async (userid, password, type) => {
      try {
          const response = await axios.post(`${API_URL}/sign-in`, { 
              user_id: userid,
              password: password,
              type: type
          }, {
              headers: {
                  'accept': 'application/json',
                  'Content-Type': 'application/json'
              }
          });
  
          const { access_token, user_id } = response.data;
          
          if (access_token) {
              localStorage.setItem('access_token', access_token);
              localStorage.setItem('user_type', type);
              setAuthHeader(access_token);
          }
          
          return {
              user: {
                  userid: user_id,
                  token: access_token,
                  type: type
              }
          };
      } catch (error) {
          console.error('Login error details:', error.response?.data);
          if (error.response?.status === 422) {
              const validationErrors = error.response.data.detail;
              const errorMessage = Array.isArray(validationErrors) 
                  ? validationErrors.map(err => err.msg).join(', ')
                  : '필수 필드가 누락되었습니다.';
              throw new Error(errorMessage);
          }
          const errorMessage = error.response?.data?.detail;
          if (Array.isArray(errorMessage)) {
              throw new Error(errorMessage[0]?.msg || '로그인에 실패했습니다.');
          }
          throw new Error(typeof errorMessage === 'string' ? errorMessage : '로그인에 실패했습니다.');
      }
  };

const logout = () => {
    localStorage.removeItem('access_token');
    setAuthHeader(null);
};

// 토큰 유효성 검사 함수 추가
const validateToken = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    
    try {
        // 토큰 검증 API 엔드포인트가 있다면 호출
        // const response = await axiosWithAuth.get('/validate-token');
        // return response.data.isValid;
        return true;
    } catch (error) {
        console.error('Token validation failed:', error);
        return false;
    }
};

const register = async (formData) => {
    try {
        const signUpData = {
            user_id: formData.userid,
            name: formData.name,
            password: formData.password,
            email: formData.email,
            phone: formData.phone,
            type: formData.type
        };
        const response = await axios.post(`${API_URL}/sign-up`, signUpData);
        return response.data.message || '회원가입이 완료되었습니다.';
    } catch (error) {
        console.error('Registration error:', error.response?.data);
        throw new Error(error.response?.data?.detail || '회원가입에 실패했습니다.');
    }
};

export default { 
    login, 
    register, 
    logout, 
    validateToken,
    setAuthHeader
};