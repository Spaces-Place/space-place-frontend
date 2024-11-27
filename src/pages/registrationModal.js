import React, { useState, useEffect, useContext } from 'react';
import 'react-calendar/dist/Calendar.css';
import ItemType from '../constants/type/ItemType';
import { AuthContext } from '../utils/AuthContext';
import { Cookies } from 'react-cookie';
import authService from '../utils/authService';
import "../styles/registrationModal.css";

export default function RegistrationModal({ isOpen, onClose }) {
    const url = process.env.REACT_APP_SPACE_API;
    const cookies = new Cookies();
    const { user, isAuthenticated } = useContext(AuthContext);

    // 초기 상태 백엔드 스키마에 맞춰 재구성
    const [formData, setFormData] = useState({
        user_id: user?.userid || '',
        space_type: 'PLAYING',
        space_name: '',
        capacity: 0,
        space_size: 0,
        usage_unit: 'TIME',
        unit_price: 0,
        amenities: [],
        description: '',
        content: '',
        location: {
            type: 'Point',
            coordinates: [0, 0],
            sido: '',
            address: ''
        },
        operating_hour: [{
            day: 'MONDAY',
            open: '09:00',
            close: '18:00'
        }],
        images: []
    });

    // 폼 유효성 검사 함수
    const validateFormData = (data) => {
        const errors = [];
        
        if (!data.space_name) errors.push('시설명은 필수입니다');
        if (data.capacity <= 0) errors.push('수용 인원은 0보다 커야 합니다');
        if (data.space_size <= 0) errors.push('공간 크기는 0보다 커야 합니다');
        if (data.unit_price <= 0) errors.push('단위 가격은 0보다 커야 합니다');
        if (!data.location.sido || !data.location.address) {
            errors.push('주소 정보는 필수입니다');
        }
        if (!data.operating_hour?.[0]?.open || !data.operating_hour?.[0]?.close) {
            errors.push('운영 시간 정보는 필수입니다');
        }
        if (!data.description) errors.push('한줄 소개는 필수입니다');
        if (!data.content) errors.push('상세 설명은 필수입니다');
        if (!data.images.length) errors.push('최소 1개의 이미지가 필요합니다');

        return errors;
    };

    // 토큰 검증 및 갱신 함수
    const validateAndRefreshToken = async () => {
        try {
            const token = cookies.get('access_token');
            if (!token) throw new Error('토큰이 없습니다.');

            // 토큰 만료 확인 및 갱신
            if (authService.isTokenExpired(token)) {
                const newToken = await authService.refreshToken();
                if (!newToken) throw new Error('토큰 갱신 실패');
                return newToken;
            }
            return token;
        } catch (error) {
            console.error('Token validation error:', error);
            throw error;
        }
    };

    // 기본 입력 처리
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const numberFields = ['unit_price', 'capacity', 'space_size'];
        
        setFormData(prev => ({
            ...prev,
            [name]: numberFields.includes(name) ? Number(value) : value
        }));
    };

    // 위치 정보 처리
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

    // 운영 시간 처리
    const handleOperatingHourChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            operating_hour: [{
                ...prev.operating_hour[0],
                [field]: value
            }]
        }));
    };

    // 이미지 처리
    const handleImageChange = (e) => {
        if (e.target.files) {
            setFormData(prev => ({
                ...prev,
                images: Array.from(e.target.files)
            }));
        }
    };

    // 편의시설 처리
    const handleAmenitiesChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            amenities: checked 
                ? [...prev.amenities, value]
                : prev.amenities.filter(item => item !== value)
        }));
    };

    // 폼 제출 처리
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 유효성 검사
        const errors = validateFormData(formData);
        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        try {
            const validToken = await validateAndRefreshToken();
            const formDataToSend = new FormData();

            // location 데이터 준비
            const locationData = {
                type: 'Point',
                coordinates: [0, 0], // TODO: 실제 좌표값 설정 필요
                sido: formData.location.sido,
                address: formData.location.address
            };

            // operating_hour 데이터 준비
            const operatingHourData = [{
                day: formData.operating_hour[0].day,
                open: formData.operating_hour[0].open,
                close: formData.operating_hour[0].close
            }];

            // FormData에 모든 필드 추가
            Object.entries({
                user_id: formData.user_id,
                space_type: formData.space_type,
                space_name: formData.space_name,
                capacity: formData.capacity,
                space_size: formData.space_size,
                usage_unit: formData.usage_unit,
                unit_price: formData.unit_price,
                amenities: JSON.stringify(formData.amenities),
                description: formData.description,
                content: formData.content,
                location: JSON.stringify(locationData),
                operating_hour: JSON.stringify(operatingHourData)
            }).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });

            // 이미지 파일들 추가
            formData.images.forEach(image => {
                formDataToSend.append('images', image);
            });

            const response = await fetch(`${url}/spaces/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${validToken}`,
                },
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || '시설 등록에 실패했습니다.');
            }

            alert('시설이 성공적으로 등록되었습니다.');
            onClose();
            window.location.reload();

        } catch (error) {
            console.error('시설 등록 에러:', error);
            
            if (error.message.includes('토큰') || 
                error.message.includes('로그인') || 
                error.message.includes('인증')) {
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

    // 컴포넌트 마운트 시 인증 체크
    useEffect(() => {
        if (!isAuthenticated) {
            alert('로그인이 필요한 서비스입니다.');
            onClose();
            return;
        }

        if (user?.type !== 'vendor') {
            alert('공간 등록은 공간 제공자만 가능합니다.');
            onClose();
            return;
        }
    }, [isAuthenticated, user, onClose]);

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
                        {/* 시설 유형 */}
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

                        {/* 시설명 */}
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

                        {/* 주소 */}
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

                        {/* 수용 인원 */}
                        <div className="registration-form-group">
                            <label>수용 인원</label>
                            <input
                                type="number"
                                name="capacity"
                                min="1"
                                value={formData.capacity}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* 공간 크기 */}
                        <div className="registration-form-group">
                            <label>공간 크기(m²)</label>
                            <input
                                type="number"
                                name="space_size"
                                min="1"
                                value={formData.space_size}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* 운영시간 */}
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

                        {/* 이용 단위 */}
                        <div className="registration-form-group">
                            <label>이용 단위</label>
                            <select
                                name="usage_unit"
                                value={formData.usage_unit}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="TIME">시간단위</option>
                                <option value="DAY">일단위</option>
                            </select>
                        </div>

                        {/* 단위 가격 */}
                        <div className="registration-form-group">
                            <label>단위 가격</label>
                            <input
                                type="number"
                                name="unit_price"
                                min="0"
                                value={formData.unit_price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* 편의시설 */}
                        <div className="registration-form-group">
                            <label>편의시설</label>
                            <div className="amenities-checkboxes">
                                <label>
                                    <input
                                        type="checkbox"
                                        value="wifi"
                                        checked={formData.amenities.includes('wifi')}
                                        onChange={handleAmenitiesChange}
                                    />
                                    Wi-Fi
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        value="parking"
                                        checked={formData.amenities.includes('parking')}
                                        onChange={handleAmenitiesChange}
                                    />
                                    주차장
                                </label>
                                {/* 추가 편의시설 체크박스들 */}
                            </div>
                        </div>

                        {/* 한줄 소개 */}
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
                        {/* 상세 설명 */}
                        <div className="registration-form-group">
                            <label>상세 설명</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                required
                                placeholder="시설에 대한 상세한 설명을 입력해주세요"
                                rows="4"
                            />
                        </div>

                        {/* 이미지 업로드 */}
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
                            {formData.images.length > 0 && (
                                <small className="image-count">
                                    {formData.images.length}개의 이미지가 선택됨
                                </small>
                            )}
                        </div>

                        {/* 버튼 영역 */}
                        <div className="registration-modal-actions">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="registration-cancel-button"
                            >
                                취소
                            </button>
                            <button 
                                type="submit" 
                                className="registration-submit-button"
                            >
                                등록하기
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}