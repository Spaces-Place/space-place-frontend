// authService.js
import axios from 'axios';
import { Cookies } from 'react-cookie';


const cookies = new Cookies();
const API_URL = process.env.REACT_APP_SPACE_API;
console.log('API URL:', API_URL);

console.log('NODE_ENV:', process.env.NODE_ENV);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

const COOKIE_OPTIONS = {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
};

const setAuthHeader = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

const login = async (userid, password, type) => {
    try {
        const response = await api.post('/members/sign-in', { 
            user_id: userid,
            password: password,
            type: type
        });


        const { access_token, user_id } = response.data;
        
        if (access_token) {
            cookies.set('access_token', access_token, COOKIE_OPTIONS);
            cookies.set('user_id', user_id, COOKIE_OPTIONS);
            cookies.set('user_type', type, COOKIE_OPTIONS);
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

const getUserInfo = async(userId) => {
    try {
        const token = cookies.get('access_token');
        if(!token) {
            throw new Error('인증토큰없음')
        }
        const response = await api.get(`/members/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    }catch(error){
        throw new Error(error.response?.data?.detail || '사용자 정보 조회에 실패했습니다.');
    }
}

const validateToken = async () => {
    const token = cookies.get('access_token');
    if (!token) return false;
    
    try {
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
        const response = await api.post(`/members/sign-up`, signUpData);
        return response.data.message || '회원가입이 완료되었습니다.';
    } catch (error) {
        console.error('Registration error:', error.response?.data);
        throw new Error(error.response?.data?.detail || '회원가입에 실패했습니다.');
    }
};

export default { 
    login, 
    register, 
    validateToken,
    setAuthHeader,
    getUserInfo
};