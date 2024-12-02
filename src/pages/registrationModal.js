import React, { useState, useEffect, useContext } from 'react';
import 'react-calendar/dist/Calendar.css';
import ItemType from '../constants/type/ItemType';
import { AuthContext } from '../utils/AuthContext';
import { Cookies } from 'react-cookie';
import authService from '../utils/authService';
import "../styles/registrationModal.css";
import { createSpace } from '../utils/spaceService';
import { Button, Dropdown, DropdownButton, FloatingLabel, Form, InputGroup, ListGroup } from 'react-bootstrap';

export default function RegistrationModal({ isOpen, onClose }) {
    const url = process.env.REACT_APP_SPACE_API;
    console.log('API URL:', url);
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

        if (numberFields.includes(name) && isNaN(value)) {
            return;
        }

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
    const [inputAmenity, setInputAmenity] = useState('')

    const handleAmenitiesChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            amenities: checked
                ? [...prev.amenities, value]
                : prev.amenities.filter(item => item !== value)
        }));
    };

    const addAmenity = (event) => {
        if (event.key === "Enter") {
            const trimmedValue = inputAmenity.trim();
            if (trimmedValue !== '') {
                if (!formData.amenities.includes(trimmedValue)) {
                    setFormData(prev => ({
                        ...prev,
                        amenities: [...prev.amenities, trimmedValue]
                    }));
                }
                setInputAmenity(''); // 입력 필드 비우기
            }
        }
    };

    const removeAmenity = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.filter(item => item !== tagToRemove)
        }));
    };

    // 폼 제출 처리
    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateFormData(formData);
        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        try {
            const validToken = await validateAndRefreshToken();
            const formDataToSend = new FormData();

            // 기본 필드들 개별적으로 추가
            formDataToSend.append('user_id', user.userid);
            formDataToSend.append('space_type', formData.space_type);
            formDataToSend.append('space_name', formData.space_name);
            formDataToSend.append('capacity', formData.capacity);
            formDataToSend.append('space_size', formData.space_size);
            formDataToSend.append('usage_unit', formData.usage_unit);
            formDataToSend.append('unit_price', formData.unit_price);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('content', formData.content);

            // 위치 정보 JSON 문자열로 변환
            const locationData = {
                type: 'Point',
                coordinates: [0, 0],
                sido: formData.location.sido,
                address: formData.location.address
            };
            formDataToSend.append('location', JSON.stringify(locationData));

            // 운영 시간 JSON 문자열로 변환
            formDataToSend.append('operating_hour', JSON.stringify([{
                day: formData.operating_hour[0].day,
                open: formData.operating_hour[0].open,
                close: formData.operating_hour[0].close
            }]));

            // 편의시설 배열 처리
            formData.amenities.forEach(amenity => {
                formDataToSend.append('amenities', amenity);
            });

            // 이미지 파일들 추가
            formData.images.forEach(image => {
                formDataToSend.append('images', image);
            });

            // 전송 전 데이터 확인
            console.log('Sending FormData:');
            for (let [key, value] of formDataToSend.entries()) {
                console.log(key, value);
            }

            const response = await createSpace(formDataToSend);
            alert('시설이 성공적으로 등록되었습니다.');
            onClose();
            window.location.reload();

        } catch (error) {
            console.error('시설 등록 에러:', error);
            const errorMessage = error.response?.data?.detail || error.message || '시설 등록에 실패했습니다.';
            alert(errorMessage);
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
        <div className="registration_modal-overlay">
            <div className="registration_modal-wrap">
                <button onClick={onClose} className="registration_close-button">×</button>
                <div className="registration_modal-title">
                    <h3>새 시설 등록</h3>
                </div>
                <div className="registration_modal-content">
                    <form className="registration_form">
                        {/* 시설 유형 */}
                        <InputGroup className="mb-3">
                            <InputGroup.Text>시설명</InputGroup.Text>
                            <Form.Control
                                min="1"
                                name="space_name"
                                value={formData.space_name}
                                onChange={handleInputChange}
                                required 
                                className="registration_input"
                            />
                            <DropdownButton
                                variant="outline-secondary"
                                title={formData.space_type ? ItemType.find(item => item.type === formData.space_type)?.title : "선택하세요"}
                                id="input-group-dropdown-1"
                                onSelect={(eventKey) => handleInputChange({ target: { name: "space_type", value: eventKey } })}
                            >
                                {ItemType.map(({ type, title }) => (
                                    <Dropdown.Item key={type} eventKey={type}>
                                        {title}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </InputGroup>

                        {/* 주소 */}
                        <div className="registration_form-group">
                            <label>주소</label>
                            <input
                                type="text"
                                name="sido"
                                placeholder="시/도"
                                value={formData.location.sido}
                                onChange={handleLocationChange}
                                required
                                className="registration_input address"
                            />
                            <input
                                type="text"
                                name="address"
                                placeholder="상세주소"
                                value={formData.location.address}
                                onChange={handleLocationChange}
                                required
                                className="registration_input address"
                            />
                        </div>

                        {/* 수용 인원 & 공간 크기 */}
                        <InputGroup className="mb-3">
                            <InputGroup.Text>수용 인원(명)</InputGroup.Text>
                            <Form.Control
                                min="1"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleInputChange}
                                required 
                                className="registration_input"
                            />
                            <InputGroup.Text>공간 크기(m²)</InputGroup.Text>
                            <Form.Control
                                name="space_size"
                                min="1"
                                value={formData.space_size}
                                onChange={handleInputChange}
                                required
                                className="registration_input"
                            />
                        </InputGroup>

                        {/* 운영시간 */}
                        <div className="registration_form-group">
                            <label>운영시간</label>
                            <div className="registration_time-inputs">
                                <select
                                    value={formData.operating_hour[0].day}
                                    onChange={(e) => handleOperatingHourChange('day', e.target.value)}
                                    required
                                    className="registration_select"
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
                                    className="registration_input"
                                />
                                <span>~</span>
                                <input
                                    type="time"
                                    value={formData.operating_hour[0].close}
                                    onChange={(e) => handleOperatingHourChange('close', e.target.value)}
                                    required
                                    className="registration_input"
                                />
                            </div>
                        </div>

                        {/* 이용 단위 & 가격 */}
                        <InputGroup className="mb-3">
                            <DropdownButton
                                variant="outline-secondary"
                                title={formData.usage_unit === "TIME" ? "시간단위" : "일단위"}
                                onSelect={(eventKey) => handleInputChange({ target: { name: "usage_unit", value: eventKey } })}
                            >
                                <Dropdown.Item eventKey="TIME">시간단위</Dropdown.Item>
                                <Dropdown.Item eventKey="DAY">일단위</Dropdown.Item>
                            </DropdownButton>
                            <Form.Control
                                name="unit_price"
                                value={formData.unit_price}
                                onChange={handleInputChange}
                                required
                                className="registration_input"
                            />
                            <InputGroup.Text>원</InputGroup.Text>
                        </InputGroup>

                        {/* 편의시설 */}
                        <div className="mb-3">
                            <Form.Label>편의 시설</Form.Label>
                            <div className="registration_amenities-container">
                                {formData.amenities.map((amenity, index) => (
                                    <ListGroup.Item
                                        key={index}
                                        className="registration_amenity-item"
                                    >
                                        {amenity}
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm" 
                                            onClick={() => removeAmenity(amenity)}
                                            className="registration_remove-btn"
                                        >
                                            x
                                        </Button>
                                    </ListGroup.Item>
                                ))}
                                <Form.Control
                                    type="text"
                                    name="amenities"
                                    value={inputAmenity}
                                    onChange={(e) => setInputAmenity(e.target.value)}
                                    onKeyUp={addAmenity}
                                    placeholder="입력 후 엔터"
                                    className="registration_amenity-input"
                                />
                            </div>
                        </div>

                        {/* 한줄 소개 */}
                        <div className="mb-3">
                            <FloatingLabel
                                controlId="floatingTextarea"
                                label="한줄 소개"
                            >
                                <Form.Control
                                    as="textarea"
                                    placeholder="Leave a comment here"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    className="registration_textarea"
                                />
                            </FloatingLabel>
                        </div>

                        {/* 상세 설명 */}
                        <div className="mb-3">
                            <FloatingLabel controlId="floatingTextarea2" label="상세 설명">
                                <Form.Control
                                    name="content"
                                    as="textarea"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    placeholder="시설에 대한 상세한 설명을 입력해주세요"
                                    required
                                    style={{ height: '100px' }}
                                    className="registration_textarea"
                                />
                            </FloatingLabel>
                        </div>

                        {/* 이미지 업로드 */}
                        <div className="registration_form-group-image">
                            <label>이미지 업로드</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                                className="registration_image-input"
                            />
                            {formData.images.length > 0 && (
                                <small className="registration_image-count">
                                    {formData.images.length}개의 이미지가 선택됨
                                </small>
                            )}
                        </div>

                        {/* 버튼 영역 */}
                        <div className="registration_modal-actions2">
                            <Button 
                                type="button" 
                                variant="outline-secondary" 
                                className="registration_cancel-button" 
                                onClick={onClose}
                            >
                                취소
                            </Button>
                            <Button 
                                type="button" 
                                variant="outline-success" 
                                className="registration_submit-button" 
                                onClick={handleSubmit}
                            >
                                등록
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}