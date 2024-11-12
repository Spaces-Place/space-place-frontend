import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "../css/playingDetail.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import {Map, MapMarker} from 'react-kakao-maps-sdk';

import 'swiper/css';
import 'swiper/css/navigation'; 
import 'swiper/css/pagination';

export default function PlayingDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [playingData, setplayingData] = useState(null);
    const [showContact, setShowContact] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [coordinates, setCoordinates] =useState(null);

    // 임시 데이터 - 실제로는 API에서 가져올 데이터
    const templayingData= [{
        id: 1,
        title: "사운드웨이브 스튜디오",
        location: "서울시 마포구",
        price: "월 800,000원",
        size: "50평",
        description: "최신 음향장비가 구비된 프리미엄 합주실",
        facilities: ["주차장", "휴게실", "녹음실", "물품보관함", "음료 자판기"],
        address: "서울 마포구 월드컵북로1길 18 지하",
        instruments: ["드럼(DW)", "기타앰프(Marshall)", "베이스앰프(Ampeg)", "키보드(Nord)", "마이크(Shure)"],
        Images: [
            "/playing1.jpg",
            "/playing2.jpg",
            "/playing3.jpg",
            "/playing4.jpg",
        ],
        contact: {
            name: "김뮤직",
            phone: "010-1234-5678",
            email: "soundwave@example.com"
        }
    },
    {
        id: 2,
        title: "멜로디 팩토리",
        location: "서울시 홍대입구",
        price: "월 600,000원",
        size: "30평",
        description: "밴드 연습에 최적화된 넓은 공간",
        facilities: ["주차장", "휴게실", "수면실", "탈의실"],
        address: "서울시 마포구 홍대로 456",
        instruments: ["드럼(Pearl)", "기타앰프(Fender)", "베이스앰프(Ampeg)", "키보드(Yamaha)", "마이크(AKG)"],
        Images: [
            "/api/placeholder/800/400",
            "/api/placeholder/400/300",
            "/api/placeholder/400/300",
            "/api/placeholder/400/300"
        ],
        contact: {
            name: "박밴드",
            phone: "010-9876-5432",
            email: "melody@example.com"
        }
    },
    {
        id: 3,
        title: "리듬 스페이스",
        location: "서울시 강남구",
        price: "월 1,000,000원",
        size: "80평",
        description: "방음 시설이 완벽한 실용적인 합주실",
        facilities: ["주차장", "휴게실", "녹음실", "샤워실", "카페테리아", "개인사물함"],
        address: "서울시 강남구 테헤란로 789",
        instruments: ["드럼(Tama)", "기타앰프(Mesa Boogie)", "베이스앰프(Markbass)", "그랜드피아노(Yamaha)", "마이크(Neumann)"],
        Images: [
            "/api/placeholder/800/400",
            "/api/placeholder/400/300",
            "/api/placeholder/400/300",
            "/api/placeholder/400/300"
        ],
        contact: {
            name: "이리듬",
            phone: "010-5555-7777",
            email: "rhythm@example.com"
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
        const playing = templayingData.find(playing => playing.id === parseInt(id));
        setplayingData(playing);
        
        if (playing) {
            convertAddressToCoords(playing.address)
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

    if (!playingData) {
        return <div>합주실 정보를 찾을 수 없습니다.</div>;
    }


    const handleBooking = () => {
        navigate('/booking', { 
            state: { 
                spaceType: 'playing',
                spaceId: id,
                title: playingData.title,
                price: playingData.price
            } 
        });
    };

    return (
        <>
            <div className='navplace' />
            <div className='playing-big-container'>
                <div className="playing-detail-container">
                    <div className="playing-header">
                        <h1>{playingData.title}</h1>
                        <p className="location">{playingData.location}</p>
                    </div>
                    <div className="playing-images">
                        <div className="sub-images">
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
                                {playingData.Images.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        {({ isActive }) => (
                                             <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'scale-90 opacity-50'}`}>
                                            <img 
                                                src={img} 
                                                alt={`합주실 이미지 ${index + 1}`}
                                                className="playingImage w-full h-64 object-cover"
                                                style={{width: '100%', height: 'auto', maxHeight: "250px"}}
                                            />
                                            </div>
                                        )}
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>

                    <div className="playing-info">
                        <div className="info-section">
                            <h2>기본 정보</h2>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>임대료</th>
                                        <td>{playingData.price}</td>
                                    </tr>
                                    <tr>
                                        <th>면적</th>
                                        <td>{playingData.size}</td>
                                    </tr>
                                    <tr>
                                        <th>위치</th>
                                        <td>{playingData.address}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="info-section">
                            <h2>합주실 소개</h2>
                            <p>{playingData.description}</p>
                        </div>
                        <div className="info-section">
                            <h2>가능 악기</h2>
                            <p>{playingData.instruments}</p>
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
                                        title={playingData.title}
                                    />
                                </Map>
                            )}
                        </div>
                        <div className="info-section">
                            <h2>편의시설</h2>
                            <ul className="facilities-list">
                                {playingData.facilities.map((facility, index) => (
                                    <li key={index}>{facility}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="info-section">
                            <h2>문의하기</h2>
                            <div className="contact-info">
                                <p>담당자: {playingData.contact.name}</p>
                                <p>연락처: {playingData.contact.phone}</p>
                                <p>이메일: {playingData.contact.email}</p>
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