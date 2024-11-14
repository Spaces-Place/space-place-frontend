import { useState } from 'react';
import { X } from 'lucide-react';
import '../styles/registration.css'
import ItemType from "../components/type/ItemType"

export default function RegistrationModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        space_id: '',
        vendor_id: '',
        space_type: '',
        name: '',
        capacity: '',
        space_size: '',
        usage_unit: '',
        unit_price: '',
        location: {
            sido: '',
            address: '',
            type: 'Point',
            coordinates: {
                latitude: '',
                longitude: ''
            }
        },
        images: [],
        amenities: [],
        description: {
            overview: '',
            content: ''
        },
        operating_hours: [],
        created_at: new Date().toISOString(),
        is_operate: true
    });

   const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleOperatingHours = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            operating_hours: prev.operating_hours.map((hour, i) => 
                i === index ? { ...hour, [field]: value } : hour
            )
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file, index) => ({
            url: URL.createObjectURL(file),
            order: formData.images.length + index + 1
        }));
        
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('제출된 데이터:', formData);
        onClose();
    };

    if (!isOpen) return null;


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>새로운 공간 등록</h2>
                    <button onClick={onClose} className="close-btn">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="form-container">
                    <div className="input-group">
                        <div>
                            <label className="form-label">시설 유형</label>
                            <select 
                                name="space_type" 
                                value={formData.space_type} 
                                onChange={handleInputChange} 
                                className="form-input"
                            >
                                <option value="">선택하세요</option>
                                {ItemType.map(({ type, title }) => (
                                    <option key={type} value={type}>
                                        {title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="form-label">시설명</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>

                        <div className="grid-2">
                            <div>
                                <label className="form-label">시/도</label>
                                <input
                                    type="text"
                                    name="location.sido"
                                    value={formData.location.sido}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label className="form-label">상세주소</label>
                                <input
                                    type="text"
                                    name="location.address"
                                    value={formData.location.address}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="grid-2">
                            <div>
                                <label className="form-label">수용 인원</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label className="form-label">공간 크기</label>
                                <input
                                    type="text"
                                    name="space_size"
                                    value={formData.space_size}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="grid-2">
                            <div>
                                <label className="form-label">이용 단위</label>
                                <select
                                    name="usage_unit"
                                    value={formData.usage_unit}
                                    onChange={handleInputChange}
                                    className="form-input"
                                >
                                    <option value="">선택</option>
                                    <option value="hour">시간</option>
                                    <option value="day">일</option>
                                    <option value="week">주</option>
                                    <option value="month">월</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">단위 가격</label>
                                <input
                                    type="number"
                                    name="unit_price"
                                    value={formData.unit_price}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">개요</label>
                            <textarea
                                name="description.overview"
                                value={formData.description.overview}
                                onChange={handleInputChange}
                                className="form-textarea"
                            />
                        </div>

                        <div>
                            <label className="form-label">상세 내용</label>
                            <textarea
                                name="description.content"
                                value={formData.description.content}
                                onChange={handleInputChange}
                                className="form-textarea"
                            />
                        </div>

                        <div>
                            <label className="form-label">이미지 업로드</label>
                            <div className="image-upload">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                <p>최대 5장까지 업로드 가능합니다.</p>
                            </div>
                            {formData.images.length > 0 && (
                                <div className="preview-container">
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={image.url}
                                                alt={`Preview ${index}`}
                                                className="preview-image"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        images: prev.images.filter((_, i) => i !== index)
                                                    }));
                                                }}
                                                className="remove-btn"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="btn-container">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cancel-btn"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                        >
                            등록하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}