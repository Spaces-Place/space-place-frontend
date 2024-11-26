// authService.js
import axios from 'axios';
import { Cookies } from 'react-cookie';


const cookies = new Cookies();
const API_URL = process.env.REACT_APP_MEMBER_API;
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


        const { access_token, user_id, name } = response.data;

        if (access_token) {
            // 토큰은 쿠키에 저장
            cookies.set('access_token', access_token, COOKIE_OPTIONS);

            // 사용자정보는 로컬스토리지에 저장
            const userData = {
                userid : user_id,
                name : name,
                type : type
            }
            localStorage.setItem('user', JSON.stringify(userData));

            setAuthHeader(access_token);
            return {user: userData};
        }

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
            throw new Error('인증토큰없음');
        }
        const response = await api.get(`/members/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        // 사용자 정보 업데이트
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    } catch(error) {
        throw new Error(error.response?.data?.detail || '사용자 정보 조회에 실패했습니다.');
    }
};

const refreshToken = async () => {
    try {
        const response = await api.post('/members/refresh', {}, {
            headers: {
                'Authorization': `Bearer ${cookies.get('access_token')}`
            }
        });
        
        const { access_token } = response.data;
        cookies.set('access_token', access_token, COOKIE_OPTIONS);
        setAuthHeader(access_token);
        return access_token;
    } catch (error) {
        throw new Error('토큰 갱신 실패');
    }
};


// cookies.js는 이제 토큰 관련 작업에만 사용됩니다
const SECURE_COOKIE_OPTIONS = {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    httpOnly: true // 추가된 보안 옵션
};

export const setCookie = (name, value, options = {}) => {
    return cookies.set(name, value, {
        ...SECURE_COOKIE_OPTIONS,
        ...options
    });
};

export const getCookie = (name) => {
    return cookies.get(name);
};

export const removeCookie = (name) => {
    return cookies.remove(name, {path: '/'});
};

const validateToken = async () => {
    // 쿠키에서만 토큰 확인
    const token = cookies.get('access_token');
    if (!token) return false;
    
    try {
        // 토큰 유효성 검증
        if (isTokenExpired(token)) {
            return false;
        }
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
        
        // 회원가입 성공 시 사용자 정보를 로컬 스토리지에 저장
        const userData = {
            userid: formData.userid,
            name: formData.name,
            type: formData.type,
            email: formData.email
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        return response.data.message || '회원가입이 완료되었습니다.';
    } catch (error) {
        console.error('Registration error:', error.response?.data);
        throw new Error(error.response?.data?.detail || '회원가입에 실패했습니다.');
    }
};

const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

export default {
    login,
    register,
    validateToken,
    setAuthHeader,
    getUserInfo,
    refreshToken,
    isTokenExpired
};