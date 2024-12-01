import { useState, useEffect, useContext } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/OwnerMypage.css';
import { AuthContext } from "../utils/AuthContext";
import authService from '../utils/authService';
import UserInfomation from "../components/UserInfo";
import RegistrationModal from "./registrationModal";

export default function OwnerMypage() {
    const {user, isAuthenticated, logout} = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('all');
    const [date, setDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
console.log(user);
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setLoading(true);
                if (!user || !user.userid) {
                    throw new Error('사용자 정보가 없습니다');
                }
                console.log("Fetching info for user:", user.userid);
                const info = await authService.getUserInfo(user.userid);
                setUserInfo(info);
                setError(null);
            } catch (err) {
                setError('사용자 정보를 불러오는데 실패했습니다.');
                console.error('Error fetching user info:', err);
                // 인증 관련 에러인 경우 로그아웃 처리
                if (err.message.includes('인증') || err.message.includes('토큰')) {
                    logout();
                }
            } finally {
                setLoading(false);
            }
        };
    
        if (isAuthenticated && user?.userid) {
            fetchUserInfo();
        }
    }, [user?.userid, isAuthenticated]);


    // 시설 데이터 예시 (스키마 기반)
    const facilityData = [
        {
            id: 1,
            type: 'camp',
            vendor_name: '숲속 글램핑 파크',
            address: '강원도 춘천시',
            price: 500000,
            usage_unit: '일',
            entry_time: '14:00',
            exit_time: '11:00',
            capacity: 4,
            space_size: '6m x 8m',
            contents: '자연 속에서 즐기는 프리미엄 글램핑',
            status: 'active'
        },
        {
            id: 2,
            type: 'rehearsal',
            vendor_name: '사운드웨이브 스튜디오',
            address: '서울시 마포구',
            price: 20000,
            usage_unit: '시간',
            open_time: '10:00',
            close_time: '22:00',
            capacity: 5,
            instruments: '드럼, 기타, 베이스, 앰프',
            contents: '프리미엄 합주실',
            status: 'maintenance'
        }
    ];

    // 예약 데이터 예시 (스키마 기반)
    const bookingData = [
        {
            id: 1,
            service_id: 1,
            service_type: 'camp',
            user_id: 'user1',
            res_date: '2024-11-20',
            start_time: '14:00',
            end_time: '11:00',
            customerName: '김고객',  // 조인된 데이터
            contact: '010-1234-5678',  // 조인된 데이터
            status: 'confirmed'
        },
        {
            id: 2,
            service_id: 2,
            service_type: 'rehearsal',
            user_id: 'user2',
            res_date: '2024-11-15',
            start_time: '18:00',
            end_time: '20:00',
            customerName: '이용자',  // 조인된 데이터
            contact: '010-9876-5432',  // 조인된 데이터
            status: 'pending'
        }
    ];



    const getStatusStyle = (status) => {
        const styles = {
            confirmed: "s-confirm",
            pending: "s-pending",
            completed: "s-complete",
            cancelled: "s-cancel",
            active: "s-active",
            maintenance: "s-maint"
        };
        return styles[status] || "";
    };

    const getStatusText = (status) => {
        const texts = {
            confirmed: "예약 확정",
            pending: "승인 대기",
            completed: "이용완료",
            cancelled: "취소됨",
            active: "운영중",
            maintenance: "점검중"
        };
        return texts[status] || status;
    };

    const filteredBookings = bookingData.filter(booking => 
        activeTab === 'all' || booking.service_type === activeTab
    );

    const handleBookingAction = (e, booking, action) => {
        e.stopPropagation();
        const actions = {
            confirm: '예약을 승인하시겠습니까?',
            reject: '예약을 거절하시겠습니까?',
            cancel: '예약을 취소하시겠습니까?'
        };
        
        if (window.confirm(actions[action])) {
            console.log(`${action} booking:`, booking.id);
        }
    };

    const handleFacilityAction = (e, facility, action) => {
        e.stopPropagation();
        const actions = {
            edit: '시설 정보를 수정하시겠습니까?',
            maintenance: '시설을 점검 모드로 전환하시겠습니까?'
        };
        
        if (window.confirm(actions[action])) {
            console.log(`${action} facility:`, facility.id);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = date.toISOString().split('T')[0];
            const bookingsOnDate = bookingData.filter(booking => booking.res_date === dateStr);
            
            if (bookingsOnDate.length > 0) {
                return (
                    <div className="cal-dot">
                        {bookingsOnDate.map(booking => (
                            <span 
                                key={booking.id} 
                                className={`dot ${getStatusStyle(booking.status)}`}
                            />
                        ))}
                    </div>
                );
            }
        }
    };

    return (
        <div className="owner-wrap">
            <div className="owner-header"></div>
            <div className="owner-container">
                <div className="owner-info">
                    <h2 className="owner-title">관리자 페이지</h2>
                    <UserInfomation 
                        userInfo={userInfo}
                        loading={loading}
                        error={error}
            />
                </div>

                {/* 시설 관리 섹션 */}
                <div className="owner-fac-mgmt">
                    <h2>시설 관리</h2>
                    <button className="owner-add-btn" onClick={() => setIsModalOpen(true)}>
                        새 시설 등록
                    </button>
                    <div className="owner-fac-list">
                        {facilityData.map((facility) => (
                            <div key={facility.id} className="owner-fac-item">
                                <div className="owner-fac-content">
                                    <h3>{facility.vendor_name}</h3>
                                    <p>위치: {facility.address}</p>
                                    <p>기본 요금: {facility.price}원/{facility.usage_unit}</p>
                                    <p>수용 인원: {facility.capacity}명</p>
                                    {facility.type === 'camp' ? (
                                        <p>입퇴실: {facility.entry_time} - {facility.exit_time}</p>
                                    ) : (
                                        <p>운영시간: {facility.open_time} - {facility.close_time}</p>
                                    )}
                                    <span className={`status ${getStatusStyle(facility.status)}`}>
                                        {getStatusText(facility.status)}
                                    </span>
                                </div>
                                <div className="owner-fac-actions">
                                    <button onClick={(e) => handleFacilityAction(e, facility, 'edit')}>
                                        정보 수정
                                    </button>
                                    <button onClick={(e) => handleFacilityAction(e, facility, 'maintenance')}>
                                        점검 모드
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 예약 관리 섹션 */}
                <div className="owner-book-mgmt">
                    <h2>예약 관리</h2>
                    <div className="owner-book-content">
                        <div className="owner-book-section">
                            <div className="owner-tab-nav">
                                <button className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('all')}>
                                    전체 예약
                                </button>
                                <button className={`tab ${activeTab === 'camp' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('camp')}>
                                    캠핑장
                                </button>
                                <button className={`tab ${activeTab === 'rehearsal' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('rehearsal')}>
                                    합주실
                                </button>
                            </div>
                            
                            <div className="owner-book-list">
                                {filteredBookings.map((booking) => (
                                    <div key={booking.id} className="owner-book-item">
                                        <div className="owner-book-content">
                                            <div>
                                                <h3>{facilityData.find(f => f.id === booking.service_id)?.vendor_name}</h3>
                                                <p>예약자: {booking.customerName}</p>
                                                <p>연락처: {booking.contact}</p>
                                                <p>예약일: {formatDate(booking.res_date)}</p>
                                                <p>시간: {booking.start_time} - {booking.end_time}</p>
                                            </div>
                                            <div className="owner-book-status">
                                                <span className={`status ${getStatusStyle(booking.status)}`}>
                                                    {getStatusText(booking.status)}
                                                </span>
                                                {booking.status === 'pending' && (
                                                    <div className="owner-book-actions">
                                                        <button
                                                            onClick={(e) => handleBookingAction(e, booking, 'confirm')}
                                                            className="confirm">
                                                            승인
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleBookingAction(e, booking, 'reject')}
                                                            className="owner-reject">
                                                            거절
                                                        </button>
                                                    </div>
                                                )}
                                                {booking.status === 'confirmed' && (
                                                    <button
                                                        onClick={(e) => handleBookingAction(e, booking, 'cancel')}
                                                        className="owner-cancel">
                                                        예약 취소
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="owner-calendar">
                            <h3 className="owner-cal-title">예약 현황</h3>
                            <Calendar
                                onChange={setDate}
                                value={date}
                                tileContent={getTileContent}
                                className="owner-cal" />
                        </div>
                    </div>
                </div>
            </div>
            
            <RegistrationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}