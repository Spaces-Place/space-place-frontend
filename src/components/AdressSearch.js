import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';

const AddressSearch = ({ onCompletePost }) => {
  const [modalState, setModalState] = useState(false);
  const [addressData, setAddressData] = useState({
    sido: '',
    address: ''
  });

  const postCodeStyle = {
    width: '400px',
    height: '400px',
    border: '1px solid #ccc'
  };

  const handleComplete = (data) => {
    // 기본 주소 데이터 설정
    const addressInfo = {
      sido: data.sido,
      address: data.roadAddress || data.jibunAddress,
      type: 'Point',
      coordinates: [0, 0] // 기본값 설정
    };

    // 위도, 경도 가져오기
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(addressInfo.address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        addressInfo.coordinates = [
          parseFloat(result[0].x), // 경도
          parseFloat(result[0].y)  // 위도
        ];
        
        setAddressData({
          sido: addressInfo.sido,
          address: addressInfo.address
        });

        // 부모 컴포넌트로 전체 데이터 전달
        onCompletePost({
          type: 'Point',
          coordinates: addressInfo.coordinates,
          sido: addressInfo.sido,
          address: addressInfo.address
        });
      }
    });

    setModalState(false);
  };

  return (
    <div className="address-wrap">
      <div className="input-group">
        <input
          type="text"
          value={addressData.sido}
          placeholder="시/도"
          className="sido-input"
          readOnly
        />
        <input
          type="text"
          value={addressData.address}
          placeholder="상세 주소"
          className="addr-input"
          readOnly
        />
        <button
          type="button"
          onClick={() => setModalState(true)}
          className="search-btn"
        >
          주소 검색
        </button>
      </div>

      {modalState && (
        <div className="modal-overlay">
          <div className="modal-content">
            <DaumPostcode
              onComplete={handleComplete}
              style={postCodeStyle}
            />
            <button 
              className="close-btn"
              onClick={() => setModalState(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSearch;