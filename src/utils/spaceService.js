// spaceService.js
import axios from 'axios';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();
const SPACE_API_URL = process.env.REACT_APP_SPACE_API;

console.log('SPACE_API_URL:', SPACE_API_URL);

export const spaceApi = axios.create({
    baseURL: SPACE_API_URL,
    headers: {
        'accept': 'application/json'
    },
    // withCredentials: false  // false로 변경
});


// 요청 인터셉터 수정
spaceApi.interceptors.request.use(
    (config) => {
        console.log('Request URL:', config.baseURL + config.url);
        const token = cookies.get('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // multipart/form-data인 경우 Content-Type 제거
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        if (config.baseURL && config.baseURL.startsWith('http:')) {
            config.baseURL = config.baseURL.replace('http:', 'https:');
        }
    
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getNearbySpaces = async (latitude, longitude, radius) => {
    try{
        const response = await spaceApi.get(`/nearby`, {
            params: {
                latitude,
                longitude,
                radius
            }
        });
        return response.data;
    }catch(error){
        console.error('Nearby spaces fetch error:', error);
        if (error.response?.data) {
            throw new Error(error.response.data.detail || '주변 공간 검색 중 오류가 발생했습니다.');
        }
        throw error;
    }
}

export const createSpace = async (formData) => {
    try {
        const response = await spaceApi.post('', formData, {
            headers: {
                // multipart/form-data는 브라우저가 자동으로 설정
                'Authorization': `Bearer ${cookies.get('access_token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Space creation error:', error);

        if (error.response) {
            console.error('Error response:', error.response.data);
            console.error('Error status:', error.response.status);
        }
        
        throw error;
    }
};