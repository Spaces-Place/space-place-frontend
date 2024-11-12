import { useEffect, useState } from "react"
import { Map, MapMarker, MapTypeControl, ZoomControl, MapTypeId } from "react-kakao-maps-sdk"

export default function MyMapPage(){
    // center와 position을 하나의 state로 통합
    const [position, setPosition] = useState({
        lat: '',
        lng:''
    })
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [userAddress, setUserAddress] = useState("");

    // 현재 위치를 가져오는 함수
    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            const currentPos = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };
            // 지도 중심과 마커 위치를 동시에 업데이트
            setPosition(currentPos);
            setLatitude(currentPos.lat);
            setLongitude(currentPos.lng);

            // 현재 위치의 주소 가져오기
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2Address(currentPos.lng, currentPos.lat, function(results, status) {
                if (status === window.kakao.maps.services.Status.OK) {
                    const addressName = results[0].address.address_name;
                    setUserAddress(addressName);
                }
            });
        });
    }

    // 페이지로드시 1회만 내위치 호출
    useEffect(() => {
        getCurrentLocation();
    }, []);

    const [traffic, setTraffic] = useState(false);
    const [mapTypeId, setMapTypeId] = useState();

    // 교통정보 토글 함수
    const toggleTraffic = () => {
        setTraffic(!traffic);
        setMapTypeId(traffic ? null : "TRAFFIC");
    };

    // 마커 드래그 핸들러
    const handleMarkerDragEnd = (marker) => {
        const markerPosition = marker.getPosition();
        const newLatitude = markerPosition.getLat();
        const newLongitude = markerPosition.getLng();

        // 마커와 지도 중심 위치를 동시에 업데이트
        const newPosition = {
            lat: newLatitude,
            lng: newLongitude
        };
        setPosition(newPosition);
        setLatitude(newLatitude);
        setLongitude(newLongitude);

        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2Address(newLongitude, newLatitude, function (results, status) {
            if (status === window.kakao.maps.services.Status.OK) {
                const addressName = results[0].address.address_name;
                setUserAddress(addressName);
            }
        });
    };

    return(
        <>
        <div>
            <Map
            id="map"
            center={position} // center를 position으로 통일
            level={4}
            style={{width:"100%", height:"90vh"}}>
             <MapMarker 
                draggable={true} 
                position={position}
                onDragEnd={(marker) => handleMarkerDragEnd(marker)} 
             />
            <MapTypeControl position={"TOPRIGHT"} />
            <ZoomControl position={"RIGHT"} />
               {mapTypeId && <MapTypeId type={mapTypeId}/>}
            </Map>
            <button onClick={toggleTraffic}>교통정보</button>
            <button onClick={getCurrentLocation}>내위치</button>
            {userAddress && <p>현재 주소: {userAddress}</p>}
        </div>
        </>
    )
}