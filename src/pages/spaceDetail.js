import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import {Map, MapMarker} from 'react-kakao-maps-sdk';
import axios from "axios";
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
    const URL = process.env.REACT_APP_SPACE_API;

    const convertAddressToCoords = (address) => {
        return new Promise((resolve, reject) => {
            if (!window.kakao || !window.kakao.maps) {
                reject('kakao map 로드안됨');
                return;
            }

            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.addressSearch(address, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    resolve(
                        
                        {
                        lat: Number(result[0].y),
                        lng: Number(result[0].x)
                    });
                } else {
                    reject('주소를 찾을 수 없습니다.');
                }
            });
        });
    };



    const getImagesUrl = (image) => {
        try {
          if (typeof image === 'string') {
            return image;
          }
          return '/images/default-image.png';
        } catch (error) {
          console.error('Error in getImageUrl:', error);
          return '/images/default-image.png';
        }
      };



    useEffect(() => {
        const fetchSpaceDetail = async () => {
            try {
                console.log('찾고있는 type:', propType);
                console.log('찾고있는 id:', id);
    
                const response = await axios.get(`${URL}/${id}`);
                const space = response.data;
                
                if (!space) {
                    throw new Error('공간 정보를 찾을 수 없습니다.');
                }
    
                console.log('찾은 공간:', space);
                setSpaceData(space);
    
                if (space.location?.address) {
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
            } catch (error) {
                console.error("Error fetching space detail:", error);
                setIsLoading(false);
                alert(error.response?.data?.message || error.message || '공간 정보를 불러오는데 실패했습니다.');
            }
        };
    
        if (id) {
            fetchSpaceDetail();
        }
    }, [id, propType, URL]);


    if(isLoading){
        return <div>로딩중...</div>
    }

    if(!spaceData){
        return<div>공간 정보를 찾을 수 없습니다.</div>
    }
    

    const handleBooking = () => {
        navigate('/booking', {
            state: {
                spacetype: spaceData.space_type,
                spaceId: spaceData.space_id,
                name: spaceData.space_name,
                price: `${spaceData.unit_price.toLocaleString()}원 / ${spaceData.usage_unit}`,
                usageUnit: spaceData.usage_unit
            }
        });
    };

    const renderDetailAmenities = (amenities) => {
        if (!amenities) return null;
      
        return (
          <div className="detail-info-section">
            <div className="detail-amenities-list">
              {amenities.map((amenity, index) => {
                try {
                  let displayAmenity;
                  if (Array.isArray(amenity)) {
                    displayAmenity = amenity.join(', ');
                  } else if (typeof amenity === 'string') {
                    try {
                      const parsed = JSON.parse(amenity);
                      displayAmenity = Array.isArray(parsed) ? parsed.join(', ') : amenity;
                    } catch {
                      displayAmenity = amenity;
                    }
                  } else {
                    displayAmenity = String(amenity);
                  }
                  
                  return <div className="detail-info-list" key={index}>{displayAmenity}</div>;
                } catch (err) {
                  console.error('Amenity 표시 오류:', err);
                  return null;
                }
              }).filter(Boolean)}
            </div>
          </div>
        );
    };

    const renderImage = (imageUrl, alt) => (
        <img 
            src={getImagesUrl(imageUrl)}
            alt={alt}
            className="detail-img"
            style={{width: '100%', height: 'auto', maxHeight: "250px"}}
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/default-image.png";
            }}
        />
    );

    return(
        <>
        <div className="detail-header"></div>
        <div className={`detail-space-big-container ${spaceData.space_type}-theme`}>
            <div className="space-detail-container">
                <div className="detail-space-header">
                    <h1>{spaceData.name || spaceData.space_name}</h1>
                    <p className="detail-location">{spaceData.location.sido}</p>
                </div>
    
                <div className="detail-space-images">
                    {spaceData.images && spaceData.images.length > 0 ? (
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
                                            {renderImage(
                                                img,
                                                `${spaceData.name || spaceData.space_name} 이미지 ${index + 1}`
                                            )}
                                        </div>
                                    )}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="no-images">
                            {renderImage(
                                { url: "/images/default-image.png" },
                                `${spaceData.name || spaceData.space_name} 기본 이미지`
                            )}
                        </div>
                    )}
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
                        <h2>{spaceData.name || spaceData.space_name} 소개</h2>
                        <p>{spaceData.content}</p>
                    </div>
                    {spaceData.amenities && (
                        <div className="detail-info-section">
                            <h2>편의 사항</h2>
                            <div className="detail-amenities-list">
                            {spaceData.amenities && renderDetailAmenities(spaceData.amenities)}
                            </div>
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
                                    name={spaceData.name || spaceData.space_name}
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