// spaceService.js
import axios from 'axios';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();
const SPACE_API_URL = process.env.REACT_APP_SPACE_API;

export const spaceApi = axios.create({
    baseURL: SPACE_API_URL,
    headers: {
        'accept': 'application/json'
    },
    withCredentials: false  // false로 변경
});

// 요청 인터셉터 수정
spaceApi.interceptors.request.use(
    (config) => {
        const token = cookies.get('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // multipart/form-data인 경우 Content-Type 제거
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const createSpace = async (formData) => {
    try {
        const response = await spaceApi.post('/', formData, {
            headers: {
                // multipart/form-data는 브라우저가 자동으로 설정
                'Authorization': `Bearer ${cookies.get('access_token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Space creation error:', error);
        throw error;
    }
};