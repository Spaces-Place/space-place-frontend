import { useEffect, useState } from "react"
import { Map, MapMarker, MapTypeControl, ZoomControl, MapTypeId } from "react-kakao-maps-sdk"
import { getNearbySpaces } from '../utils/spaceService';
import "../styles/mymappage.css";

export default function MyMapPage() {
    const [position, setPosition] = useState({
        lat: '',
        lng: ''
    });
    const [places, setPlaces] = useState([]);
    const [userAddress, setUserAddress] = useState("");
    const [traffic, setTraffic] = useState(false);
    const [mapTypeId, setMapTypeId] = useState();
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [radius, setRadius] = useState(1.0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchNearbyPlaces = async (lat, lng) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getNearbySpaces(lat, lng, radius);
            setPlaces(data);
        } catch (error) {
            console.error('Error fetching nearby places:', error);
            setError(error.message);
            setPlaces([]);
        } finally {
            setLoading(false);
        }
    };

    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const currentPos = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };
                setPosition(currentPos);

                const geocoder = new window.kakao.maps.services.Geocoder();
                geocoder.coord2Address(currentPos.lng, currentPos.lat, function(results, status) {
                    if (status === window.kakao.maps.services.Status.OK) {
                        const addressName = results[0].address.address_name;
                        setUserAddress(addressName);
                    }
                });

                fetchNearbyPlaces(currentPos.lat, currentPos.lng);
            },
            (error) => {
                console.error('Geolocation error:', error);
                setError('위치 정보를 가져올 수 없습니다.');
            }
        );
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const toggleTraffic = () => {
        setTraffic(!traffic);
        setMapTypeId(traffic ? null : "TRAFFIC");
    };

    const handleMarkerDragEnd = (marker) => {
        const markerPosition = marker.getPosition();
        const newLatitude = markerPosition.getLat();
        const newLongitude = markerPosition.getLng();

        const newPosition = {
            lat: newLatitude,
            lng: newLongitude
        };
        setPosition(newPosition);

        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2Address(newLongitude, newLatitude, function (results, status) {
            if (status === window.kakao.maps.services.Status.OK) {
                const addressName = results[0].address.address_name;
                setUserAddress(addressName);
            }
        });

        fetchNearbyPlaces(newLatitude, newLongitude);
    };

    return (
        <div className="mymap-container">
            <Map
                center={position}
                level={4}
                style={{width:"100%", height:"100%"}}
            >
                <MapMarker 
                    position={position}
                    draggable={true}
                    onDragEnd={(marker) => handleMarkerDragEnd(marker)}
                    image={{
                        src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
                        size: { width: 64, height: 69 },
                    }}
                />

                {places.map((place, index) => (
                    <MapMarker
                        key={index}
                        position={{ lat: place.latitude, lng: place.longitude }}
                        onClick={() => setSelectedPlace(place)}
                    />
                ))}

                <MapTypeControl position="TOPRIGHT" />
                <ZoomControl position="RIGHT" />
                {mapTypeId && <MapTypeId type={mapTypeId} />}
            </Map>

            <div className="mymap-controls">
                <div className="mymap-controls-row">
                    <button 
                        className="mymap-button mymap-button-blue"
                        onClick={toggleTraffic}
                    >
                        교통정보
                    </button>
                    <button 
                        className="mymap-button mymap-button-green"
                        onClick={getCurrentLocation}
                    >
                        내 위치
                    </button>
                </div>
                
                <div className="mymap-radius-container">
                    <span className="mymap-radius-label">반경:</span>
                    {[1.0, 3.0, 5.0].map((r) => (
                        <button
                            key={r}
                            onClick={() => {
                                setRadius(r);
                                if (position.lat && position.lng) {
                                    fetchNearbyPlaces(position.lat, position.lng);
                                }
                            }}
                            className={`mymap-radius-button ${
                                radius === r 
                                    ? 'mymap-radius-button-active' 
                                    : 'mymap-radius-button-inactive'
                            }`}
                        >
                            {r}km
                        </button>
                    ))}
                </div>
            </div>

            {userAddress && (
                <div className="mymap-address">
                    <p>현재 주소: {userAddress}</p>
                </div>
            )}

            {loading && (
                <div className="mymap-loading">
                    데이터를 불러오는 중...
                </div>
            )}

            {error && (
                <div className="mymap-error">
                    {error}
                </div>
            )}

            {selectedPlace && (
                <div className="mymap-info">
                    <h3 className="mymap-info-title">{selectedPlace.space_name}</h3>
                    <p className="mymap-info-text">{selectedPlace.address}</p>
                    <p className="mymap-info-text">{selectedPlace.description}</p>
                    <button 
                        onClick={() => setSelectedPlace(null)}
                        className="mymap-info-close"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
}