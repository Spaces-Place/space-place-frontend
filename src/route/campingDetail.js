import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "../css/campingDetail.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import {Map, MapMarker} from 'react-kakao-maps-sdk';

import 'swiper/css';
import 'swiper/css/navigation'; 
import 'swiper/css/pagination';

export default function CampingDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campingData, setcampingData] = useState(null);
    const [showContact, setShowContact] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [coordinates, setCoordinates] =useState(null);

    // 임시 데이터 - 실제로는 API에서 가져올 데이터
    const tempcampingData = [{
        id: 1,
        title: "숲속 글램핑 파크",
        location: "강원도 춘천시",
        price: "월 500,000원",
        size: "500평",
        description: "울창한 숲속에서 즐기는 프리미엄 글램핑 경험",
        facilities: ["주차장", "화장실", "샤워실", "취사장", "매점"],
        address: "강원 춘천시 동산면 종자리로 224-104",
        Images: [
            "/camping1.jpg",
            "/camping3.jpg",
            "/camping5.jpg",
            "/camping6.jpg",
        ],
        contact: {
            name: "김글램",
            phone: "010-1234-5678",
            email: "glamping@example.com"
        }
    },
    {
        id: 2,
        title: "강변 오토캠핑장",
        location: "경기도 가평군",
        price: "월 400,000원",
        size: "300평",
        description: "시원한 강가에서 즐기는 오토캠핑의 진수",
        facilities: ["전기", "화장실", "샤워실", "취사장"],
        address: "경기도 가평군 청평면 강변로 123",
        Images: [
            "/api/placeholder/800/400",
            "/api/placeholder/400/300",
            "/api/placeholder/400/300",
            "/api/placeholder/400/300"
        ],
        contact: {
            name: "박캠핑",
            phone: "010-9876-5432",
            email: "camping@example.com"
        }
    }];

    const convertAddressToCoords = (address) => {
        return new Promise((resolve, reject) => {
            if (!window.kakao || !window.kakao.maps){
                reject('kakao map 로드안됨');
                return;
            }

            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.addressSearch(address, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    resolve({
                        lat: Number(result[0].y),
                        lng: Number(result[0].x)
                    });
                } else {
                    reject('주소를 찾을 수 없습니다.');
                }
            });
        });
    };



    useEffect(() => {
        const camping = tempcampingData.find(camping => camping.id === parseInt(id));
        setcampingData(camping);
        
        if (camping) {
            convertAddressToCoords(camping.address)
                .then(coords => {
                    setCoordinates(coords);
                })
                .catch(error => {
                    console.error('주소 변환 실패:', error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [id]);


    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (!campingData) {
        return <div>캠핑장 정보를 찾을 수 없습니다.</div>;
    }

    const handleBooking = () => {
        navigate('/booking', { 
            state: { 
                spaceType: 'camping',
                spaceId: id,
                title: campingData.title,
                price: campingData.price
            } 
        });
    };

    return (
        <>
        <div className='navplace' />
        <div className='camping-big-container'>
        <div className="camping-detail-container">
            <div className="camping-header">
                <h1>{campingData.title}</h1>
                <p className="location">{campingData.location}</p>
            </div>
            <div className="camping-images">
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                centeredSlides={true}
                navigation
                loop={true}
                pagination={{ clickable: true }}
                loopedSlides={2}  // 이 옵션 추가
                className="swiper"
            >
                {campingData.Images.map((img, index) => (
                    <SwiperSlide key={index}>
                    {({ isActive }) => (
                        <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'scale-90 opacity-50'}`}>
                            <img 
                                src={img} 
                                alt={`캠핑장 이미지 ${index + 1}`}
                                className="img"
                                style={{width: '100%', height: 'auto', maxHeight: "250px"}}
                            />
                        </div>
                    )}
        </SwiperSlide>
    ))}
</Swiper>
            </div>

            <div className="camping-info">
                <div className="info-section">
                    <h2>기본 정보</h2>
                    <table>
                        <tbody>
                            <tr>
                                <th>임대료</th>
                                <td>{campingData.price}</td>
                            </tr>
                            <tr>
                                <th>면적</th>
                                <td>{campingData.size}</td>
                            </tr>
                            <tr>
                                <th>위치</th>
                                <td>{campingData.address}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="info-section">
                    <h2>캠핑장 소개</h2>
                    <p>{campingData.description}</p>
                </div>
                <div className='info-section'>
                <h2>지도</h2>
                {coordinates && (
                    <Map
                        center={coordinates}
                        style={{width:"100%", height:"350px"}}
                        level={3}
                    >
                        <MapMarker 
                            position={coordinates}
                            title={campingData.title}
                        />
                    </Map>
                )}
                {campingData.address}
            </div>
                <div className="info-section">
                    <h2>편의시설</h2>
                    <ul className="facilities-list">
                        {campingData.facilities.map((facility, index) => (
                            <li key={index}>{facility}</li>
                        ))}
                    </ul>
                </div>

                <div className="info-section">
                    <h2>문의하기</h2>
                    <div className="contact-info">
                        <p>담당자: {campingData.contact.name}</p>
                        <p>연락처: {campingData.contact.phone}</p>
                        <p>이메일: {campingData.contact.email}</p>
                    </div>
                    <button 
                        className="contact-button"
                        onClick={() => setShowContact(!showContact)}
                    >
                        문의하기
                    </button>
                </div>
                <button className="contact-button" onClick={handleBooking}>임대하기</button>
            </div>
        </div>
        </div>
        </>
    );
}