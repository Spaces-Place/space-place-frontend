import { useState } from 'react';
import { X } from 'lucide-react';

export default function FacilityRegistrationModal({ isOpen, onClose }) {
    const [facilityType, setFacilityType] = useState('camping');
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        basePrice: '',
        maxCapacity: '',
        description: '',
        facilities: [],
        rules: '',
        checkInTime: '',
        checkOutTime: '',
        images: []
    });

    // 시설 편의시설 옵션
    const facilityOptions = {
        camping: [
            '전기시설', '온수', '화장실', '샤워실', '주차장', 
            'BBQ', '매점', '와이파이', '에어컨'
        ],
        playing: [
            '드럼', '앰프', '마이크', '믹서', '스피커',
            '에어컨', '와이파이', '주차장', '휴게실'
        ]
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFacilityChange = (facility) => {
        setFormData(prev => ({
            ...prev,
            facilities: prev.facilities.includes(facility)
                ? prev.facilities.filter(f => f !== facility)
                : [...prev.facilities, facility]
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        // 실제 구현시에는 이미지 업로드 로직 추가 필요
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // API 호출 로직 추가 필요
        console.log('제출된 데이터:', { ...formData, type: facilityType });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="modal-content bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto mx-4">
                <div className="modal-header p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">새로운 공간 등록</h2>
                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* 시설 유형 선택 */}
                    <div className="mb-6">
                        <label className="block mb-2 font-semibold">시설 유형</label>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="camping"
                                    checked={facilityType === 'camping'}
                                    onChange={(e) => setFacilityType(e.target.value)}
                                    className="mr-2"
                                />
                                캠핑장
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="playing"
                                    checked={facilityType === 'playing'}
                                    onChange={(e) => setFacilityType(e.target.value)}
                                    className="mr-2"
                                />
                                합주실
                            </label>
                        </div>
                    </div>

                    {/* 기본 정보 */}
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-2 font-semibold">시설 이름</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">위치</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 font-semibold">기본 가격 (1일 기준)</label>
                                <input
                                    type="number"
                                    name="basePrice"
                                    value={formData.basePrice}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-semibold">최대 수용 인원</label>
                                <input
                                    type="number"
                                    name="maxCapacity"
                                    value={formData.maxCapacity}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 font-semibold">체크인 시간</label>
                                <input
                                    type="time"
                                    name="checkInTime"
                                    value={formData.checkInTime}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-semibold">체크아웃 시간</label>
                                <input
                                    type="time"
                                    name="checkOutTime"
                                    value={formData.checkOutTime}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>

                        {/* 시설 설명 */}
                        <div>
                            <label className="block mb-2 font-semibold">시설 설명</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded h-32"
                                required
                            />
                        </div>

                        {/* 편의시설 */}
                        <div>
                            <label className="block mb-2 font-semibold">편의시설</label>
                            <div className="grid grid-cols-3 gap-2">
                                {facilityOptions[facilityType].map((facility) => (
                                    <label key={facility} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.facilities.includes(facility)}
                                            onChange={() => handleFacilityChange(facility)}
                                            className="mr-2"
                                        />
                                        {facility}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 이용 규칙 */}
                        <div>
                            <label className="block mb-2 font-semibold">이용 규칙</label>
                            <textarea
                                name="rules"
                                value={formData.rules}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded h-32"
                                placeholder="시설 이용 시 주의사항이나 규칙을 입력해주세요."
                                required
                            />
                        </div>

                        {/* 이미지 업로드 */}
                        <div>
                            <label className="block mb-2 font-semibold">시설 이미지</label>
                            <div className="border-2 border-dashed rounded-lg p-4">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="w-full"
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    최대 5장까지 업로드 가능합니다.
                                </p>
                            </div>
                            {formData.images.length > 0 && (
                                <div className="mt-2 flex gap-2 flex-wrap">
                                    {formData.images.map((file, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Preview ${index}`}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        images: prev.images.filter((_, i) => i !== index)
                                                    }));
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 제출 버튼 */}
                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            등록하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}