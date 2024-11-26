import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import {Map, MapMarker} from 'react-kakao-maps-sdk';
import spaceDummyData from "../constants/spaceDummyData";
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


    // useEffect(() => {
    //     const numId = parseInt(id);
    //     console.log('찾고있는 type:', propType);
    //     console.log('찾고있는 id:', numId);
        
    //     // 타입과 id로 공간 찾기
    //     const space = tempSpaceData.find(space => 
    //         space.space_type === propType && space.id === numId
    //     );
        
    //     console.log('찾은 공간:', space);
    //     setSpaceData(space);
    
    //     if (space) {
    //         convertAddressToCoords(space.address)
    //             .then(coords => {
    //                 setCoordinates(coords);
    //             })
    //             .catch(error => {
    //                 console.error('주소변환 실패:', error);
    //             })
    //             .finally(() => {
    //                 setIsLoading(false);
    //             });
    //     } else {
    //         setIsLoading(false);
    //     }
    // }, [propType, id]);


    useEffect(() => {
        const numId = parseInt(id);
        console.log('찾고있는 type:', propType);
        console.log('찾고있는 id:', numId);
        
        // spaceDummyData에서 space_id로 찾도록 수정
        const space = spaceDummyData.find(space => 
            space.space_type === propType && space.space_id === numId
        );

        console.log(space);
        
        console.log('찾은 공간:', space);
        setSpaceData(space);
        
        console.log(spaceData);
        if (space) {
            // location.address를 사용하도록 수정
            convertAddressToCoords(space.location.address)
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


    // const handleBooking = () => {
    //     navigate('/booking', {
    //         state: {
    //             spacetype: spaceData.space_type,
    //             spaceId: id,
    //             name: spaceData.name,
    //             price: spaceData.price
    //         }
    //     });
    // };



    const handleBooking = () => {
        navigate('/booking', {
            state: {
                spacetype: spaceData.space_type,
                spaceId: spaceData.space_id,
                name: spaceData.name,
                price: `${spaceData.unit_price.toLocaleString()}원 / ${spaceData.usage_unit}`
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
                    <p className="detail-location">{spaceData.location.sido}</p>
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
                                            src={`/dummy/${img.filename}`}
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
                                    <td>{spaceData.unit_price.toLocaleString()}원 / {spaceData.usage_unit}</td>
                                </tr>
                                <tr>
                                    <th>면적</th>
                                    <td>{spaceData.space_size}</td>
                                </tr>
                                <tr>
                                    <th>위치</th>
                                    <td>{spaceData.location.address}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
    
                    <div className="detail-info-section">
                        <h2>{spaceData.name} 소개</h2>
                        <p>{spaceData.content}</p>
                    </div>
                    {spaceData.amenities && (
                        <div className="detail-info-section">
                            <h2>편의 사항</h2>
                            <ul className="detail-amenities-list">
                                {spaceData.amenities.map((amenity, index) => (
                                    <li key={index}>{amenity}</li>
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
                        <p className="detail-address">{spaceData.location.address}</p>
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