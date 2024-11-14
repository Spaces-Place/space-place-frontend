import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import {Map, MapMarker} from 'react-kakao-maps-sdk';
import "../styles/spaceDetail.css"

import 'swiper/css';
import 'swiper/css/navigation'; 
import 'swiper/css/pagination';

export default function SpaceDetail({type: propType}) {
    const {id} = useParams();
    const navigate = useNavigate();
    const [spaceData, setSpaceData] = useState(null);
    const [showContact, setShowContact] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [coordinates, setCoordinates] = useState(null);

     // 임시 데이터 - 실제로는 API에서 가져올 데이터
     const tempSpaceData = [
        {
            id: 1,
            name: "숲속 글램핑 파크",
            space_type: "camping",
            location: "강원도 춘천시",
            price: "월 500,000원",
            space_size: "500평",
            contents: "울창한 숲속에서 즐기는 프리미엄 글램핑 경험, 누구나 즐길수있는 쉬운캠핑! 숲속 글램핑 파크에서 체험하세요",
            address: "강원 춘천시 동산면 종자리로 224-104",
            amenities: ["주차장", "화장실", "샤워실", "취사장", "매점"],
            images: [
                "/camping1.jpg",
                "/camping3.jpg",
                "/camping5.jpg",
                "/camping6.jpg",
            ],
        },
        {
            id: 2,
            name: "사운드웨이브 스튜디오",
            space_type: "rehearsal",
            location: "서울시 마포구",
            price: "월 800,000원",
            space_size: "50평",
            contents: "넓은 주차장과 최신 음향장비가 구비된 프리미엄 합주실입니다.",
            address: "서울 마포구 월드컵북로1길 18 지하",
            amenities: ["주차장", "화장실", "드럼(DW)", "기타앰프(Marshall)", "베이스앰프(Ampeg)", "키보드(Nord)", "마이크(Shure)"],
            images: [
                "/playing1.jpg",
                "/playing2.jpg",
                "/playing3.jpg",
                "/playing4.jpg",
            ],
        },
     ];



    const convertAddressToCoords = (address) => {
        return new Promise((resolve, reject) => {
            if (!window.kakao || !window.kakao.maps) {
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
        const numId = parseInt(id);
        console.log('찾고있는 type:', propType);
        console.log('찾고있는 id:', numId);
        
        // 타입과 id로 공간 찾기
        const space = tempSpaceData.find(space => 
            space.space_type === propType && space.id === numId
        );
        
        console.log('찾은 공간:', space);
        setSpaceData(space);
    
        if (space) {
            convertAddressToCoords(space.address)
                .then(coords => {
                    setCoordinates(coords);
                })
                .catch(error => {
                    console.error('주소변환 실패:', error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [propType, id]);

    if(isLoading){
        return <div>로딩중......ㅣ</div>
    }

    if(!spaceData){
        return<div>공간 정보를 찾을 수 없습니다.</div>
    }


    const handleBooking = () => {
        navigate('/booking', {
            state: {
                spacetype: spaceData.space_type,
                spaceId: id,
                name: spaceData.name,
                price: spaceData.price
            }
        });
    };

    return(
        <>
        <div className="detail-header"></div>
        <div className={`detail-space-big-container ${spaceData.space_type}-theme`}>
            <div className="space-detail-container">
                <div className="detail-space-header">
                    <h1>{spaceData.name}</h1>
                    <p className="detail-location">{spaceData.location}</p>
                </div>

                <div className="detail-space-images">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={20}
                        slidesPerView={1}
                        centeredSlides={true}
                        navigation
                        loop={true}
                        pagination={{ clickable: true }}
                        loopedSlides={2}
                        className="swiper"
                    >
                        {spaceData.images.map((img, index) => (
                            <SwiperSlide key={index}>
                                {({ isActive }) => (
                                    <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'scale-90 opacity-50'}`}>
                                        <img 
                                            src={img} 
                                            alt={`${spaceData.name} 이미지 ${index + 1}`}
                                            className="detail-img"
                                            style={{width: '100%', height: 'auto', maxHeight: "250px"}}
                                        />
                                    </div>
                                )}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="detail-space-info">
                    <div className="detail-info-section">
                        <h2>기본 정보</h2>
                        <table>
                            <tbody>
                                <tr>
                                    <th>임대료</th>
                                    <td>{spaceData.price}</td>
                                </tr>
                                <tr>
                                    <th>면적</th>
                                    <td>{spaceData.space_size}</td>
                                </tr>
                                <tr>
                                    <th>위치</th>
                                    <td>{spaceData.address}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="detail-info-section">
                        <h2>{spaceData.name} 소개</h2>
                        <p>{spaceData.contents}</p>
                    </div>
                    {spaceData.amenities && (
                        <div className="detail-info-section">
                            <h2>편의 사항</h2>
                            <ul className="detail-amenities-list">
                                {spaceData.amenities.map((amenitie, index) => (
                                    <li key={index}>{amenitie}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className='detail-info-section'>
                        <h2>지도</h2>
                        {coordinates && (
                            <Map
                                center={coordinates}
                                style={{width:"100%", height:"350px"}}
                                level={3}
                            >
                                <MapMarker 
                                    position={coordinates}
                                    name={spaceData.name}
                                />
                            </Map>
                        )}
                        <p className="detail-address">{spaceData.address}</p>
                    </div>
                    <button className="detail-contact-button" onClick={handleBooking}>
                        예약하기
                    </button>
                </div>
            </div>
        </div>
    </>
);
}