import React, { useState, useEffect, useContext } from 'react';
import 'react-calendar/dist/Calendar.css';
import ItemType from '../constants/type/ItemType';
import { AuthContext } from '../utils/AuthContext';
import { Cookies } from 'react-cookie';
import authService from '../utils/authService';
import "../styles/registrationModal.css"


export default function RegistrationModal({ isOpen, onClose }) {
    const url = process.env.REACT_APP_SPACE_API;
    const cookies = new Cookies();
    const { user, isAuthenticated } = useContext(AuthContext);

    // 토큰 가져오기
    const getToken = () => {
        const token = cookies.get('access_token');
        if (!token) throw new Error('인증 토큰이 없습니다.');
        return token;
    };



    // 토큰 갱신 및 검증
    const validateAndRefreshToken = async () => {
        try {
            const token = cookies.get('access_token');
            if (!token) {
                throw new Error('토큰이 없습니다.');
            }


            // TODO: 구현 안된 기능임.
            // 토큰 만료 확인
            if (authService.isTokenExpired(token)) {
                console.log('토큰 만료, 갱신 시도');
                const newToken = await authService.refreshToken();
                if (!newToken) {
                    throw new Error('토큰 갱신 실패');
                }
                return newToken;
            }

            return token;
        } catch (error) {
            console.error('Token validation error:', error);
            throw error;
        }
    };

    // 초기 formData 설정
    const [formData, setFormData] = useState({
        user_id: user?.userid || '',
        space_type: 'CAMPING',
        space_name: '캠핑장',
        capacity: '22',
        space_size: '2',
        usage_unit: 'DAY',
        unit_price: '10000',
        amenities: ['wifi'],
        description: '오십쇼',
        content: '내용',
        location: {
            sido: '서울특별시',
            address: '서울특별시 독산동',
            type: 'Point',
            coordinates: [127.123456, 34.123456],
        },
        operating_hour: [{
            day: 'MONDAY',
            open: '09:00',
            close: '18:00'
        }],
        images: []
    });

    useEffect(() => {
        try {
            // 컴포넌트 마운트 시 토큰 확인
            const token = getToken();
            if (!token) {
                alert('로그인이 필요한 서비스입니다.');
                // window.location.href = '/';
                return;
            }
        } catch (error) {
            alert('로그인이 필요한 서비스입니다.');
            // window.location.href = '/';
            return;
        }

        if (!isAuthenticated) {
            alert('로그인이 필요한 서비스입니다.');
            // window.location.href = '/';
            return;
        }

        if (user?.type !== 'vendor') {
            alert('공간 등록은 공간 제공자만 가능합니다.');
            onClose();
            return;
        }
    }, [isAuthenticated, user, onClose]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'unit_price' || name === 'capacity' || name === 'space_size' || name === 'user_id') {
            setFormData(prev => ({
                ...prev,
                [name]: Number(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                [name]: value
            }
        }));
    };

    const handleOperatingHourChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            operating_hour: [{
                ...prev.operating_hour[0],
                [field]: value
            }]
        }));
    };


    const handleImageChange = (e) => {
        if (e.target.files) {
            setFormData(prev => ({
                ...prev,
                images: Array.from(e.target.files)
            }));
        }
    };




    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 토큰 검증 및 갱신
            const validToken = await validateAndRefreshToken();

            const formDataToSend = new FormData();

            // 기본 데이터 준비
            const basicData = {
                ...formData,
                user_id: user.userid,
                unit_price: Number(formData.unit_price),
                capacity: Number(formData.capacity),
                space_size: Number(formData.space_size),
                amenities: formData.amenities.length ? formData.amenities : [],
                location: {
                    ...formData.location,
                    coordinates: [0, 0]
                },
                operating_hour: formData.operating_hour.map(hour => ({
                    ...hour,
                    open: hour.open || '09:00',
                    close: hour.close || '18:00'
                }))
            };

            // FormData에 데이터 추가
            Object.keys(basicData).forEach(key => {
                if (key !== 'images') {
                    if (typeof basicData[key] === 'object') {
                        formDataToSend.append(key, JSON.stringify(basicData[key]));
                    } else {
                        formDataToSend.append(key, basicData[key]);
                    }
                }
            });

            // 이미지 처리
            if (formData.images && formData.images.length > 0) {
                formData.images.forEach((image, index) => {
                    formDataToSend.append(`images`, image);
                });
            }

            // 요청 전 데이터 확인
            console.log('Sending request with token:', validToken);
            
            debugger;

            const response = await fetch(`${url}/spaces/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${validToken}`,
                },
                // credentials: 'include',
                body: formDataToSend
            });

            console.log(response);

            const contentType = response.headers.get('content-type');
            let errorData;

            if (contentType && contentType.includes('application/json')) {
                errorData = await response.json();
            } else {
                errorData = await response.text();
            }

            if (response.status === 403) {
                console.error('Authorization error:', errorData);

                if (typeof errorData === 'object' && errorData.detail) {
                    // 토큰 관련 오류
                    cookies.remove('access_token');
                    cookies.remove('user_id');
                    cookies.remove('user_type');

                    alert('세션이 만료되었습니다. 다시 로그인해주세요.');
                    debugger;

                    window.location.href = '/';
                    return;
                }
            }

            if (!response.ok) {
                throw new Error(
                    typeof errorData === 'object' ? errorData.detail : errorData
                );
            }

            alert('시설이 성공적으로 등록되었습니다.');
            onClose();
            window.location.reload();

        } catch (error) {
            console.error('시설 등록 에러:', error);

            if (error.message.includes('토큰') ||
                error.message.includes('로그인') ||
                error.message.includes('인증')) {
                // 인증 관련 에러 처리
                cookies.remove('access_token');
                cookies.remove('user_id');
                cookies.remove('user_type');

                alert('다시 로그인해주세요.');
                window.location.href = '/';
            } else {
                alert(error.message || '시설 등록에 실패했습니다.');
            }
        }
    };



    if (!isOpen) return null;

    return (
        <div className="registration-modal-overlay">
            <div className="registration-modal-wrap">
            <button onClick={onClose} className="registration-close-button">×</button>
                <div className="registration-modal-title">
                    <h3>새 시설 등록</h3>
                </div>
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="registration-form-group">
                            <label>등록자</label>
                            <input
                                type="text"
                                name="user_id"
                                value={formData.user_id}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="registration-form-group">
                            <label>시설 유형</label>
                            <select
                                name="space_type"
                                value={formData.space_type}
                                onChange={handleInputChange}
                                required
                            >
                                {ItemType.map(({ type, title }) => (
                                    <option key={type} value={type}>{title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="registration-form-group">
                            <label>시설명</label>
                            <input
                                type="text"
                                name="space_name"
                                value={formData.space_name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Location fields */}
                        <div className="registration-form-group">
                            <label>주소</label>
                            <input
                                type="text"
                                name="sido"
                                placeholder="시/도"
                                value={formData.location.sido}
                                onChange={handleLocationChange}
                                required
                                className='address'
                            />
                            <input
                                type="text"
                                name="address"
                                placeholder="상세주소"
                                value={formData.location.address}
                                onChange={handleLocationChange}
                                required
                                className='address'
                            />
                        </div>

                        <div className="registration-form-group">
                            <label>수용 인원</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="registration-form-group">
                            <label>공간 크기(m²)</label>
                            <input
                                type="number"
                                name="space_size"
                                value={formData.space_size}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="registration-form-group">
                            <label>운영시간</label>
                            <div className="time-inputs">
                                <select
                                    value={formData.operating_hour[0].day}
                                    onChange={(e) => handleOperatingHourChange('day', e.target.value)}
                                    required
                                >
                                    <option value="MONDAY">월요일</option>
                                    <option value="TUESDAY">화요일</option>
                                    <option value="WEDNESDAY">수요일</option>
                                    <option value="THURSDAY">목요일</option>
                                    <option value="FRIDAY">금요일</option>
                                    <option value="SATURDAY">토요일</option>
                                    <option value="SUNDAY">일요일</option>
                                </select>
                                <input
                                    type="time"
                                    value={formData.operating_hour[0].open}
                                    onChange={(e) => handleOperatingHourChange('open', e.target.value)}
                                    required
                                />
                                <span>~</span>
                                <input
                                    type="time"
                                    value={formData.operating_hour[0].close}
                                    onChange={(e) => handleOperatingHourChange('close', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="registration-form-group">
                            <label>이용 단위</label>
                            <select
                                name="usage_unit"
                                value={formData.usage_unit}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="DAY">일단위</option>
                                <option value="TIME">시간단위</option>
                            </select>
                        </div>

                        <div className="registration-form-group">
                            <label>단위 가격</label>
                            <input
                                type="number"
                                name="unit_price"
                                value={formData.unit_price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="registration-form-group">
                            <label>한줄 소개</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="registration-form-group">
                            <label>상세 설명</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="registration-form-group-image">
                            <label>이미지 업로드</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                                className='registration-image'
                            />
                        </div>

                        <div className="registration-modal-actions">
                            <button type="button" onClick={onClose} className="registration-cancel-button">
                                취소
                            </button>
                            <button type="submit" className="registration-submit-button">
                                등록하기
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}