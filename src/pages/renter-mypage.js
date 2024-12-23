import { useContext, useEffect, useState } from "react";
import {useNavigate, Navigate} from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/mypage.css';
import { AuthContext } from "../utils/AuthContext";
import authService from '../utils/authService';
import UserInfomation from "../components/UserInfo";

export default function RenterMypage() {
    const navigate = useNavigate();
    const {user, isAuthenticated, logout} = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('all');
    const [date, setDate] = useState(new Date());
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                if (!user?.userid) return;
                
                const info = await authService.getUserInfo(user.userid);
                setUserInfo(info);

                const basicUserInfo = {
                    userid : info.user_id,
                    type : info.type
                };

                localStorage.setItem('user', JSON.stringify({
                    ...basicUserInfo,
                    fullInfo: info
                }))

                setError(null);
            } catch (err) {
                console.error('Error fetching user info:', err);
                setError('사용자 정보를 불러오는데 실패했습니다.');
                if (err.message.includes('인증')) {
                    logout();
                }
            } finally {
                setLoading(false);
            }
        };
    
        if (isAuthenticated && user?.userid) {
            fetchUserInfo();
        }
    }, [user?.userid, isAuthenticated, logout]);
    


    const bookingData = [
        {
            id: 1,
            type: 'camping',
            title: '숲속 글램핑 파크',
            date: '2024-11-20',
            startTime: '14:00',
            endTime: '12:00',
            price: '500,000',
            status: 'upcoming',
        },
        {
            id: 2,
            type: 'playing',
            title: '사운드웨이브 스튜디오',
            date: '2024-11-15',
            startTime: '18:00',
            endTime: '22:00',
            price: '20,000',
            status: 'upcoming',
        },
        {
            id: 3,
            type: 'camping',
            title: '강변 오토캠핑장',
            date: '2024-10-25',
            startTime: '14:00',
            endTime: '12:00',
            price: '400,000',
            status: 'completed',
        }
    ];


    const getStatusStyle = (status) => {
        const styles = {
            upcoming: "status-upcoming",
            ongoing: "status-ongoing",
            completed: "status-completed",
            cancelled: "status-cancelled"
        };
        return styles[status] || "";
    };

    const getStatusText = (status) => {
        const texts = {
            upcoming : "예약 확정",
            ongoing : "이용중",
            completed : "이용완료",
            cancelled : "취소됨"
        };
        return texts[status] || status;
    }


    const filteredBookings = bookingData.filter(booking => activeTab === 'all' || booking.type === activeTab);

    const handleBookingClick = (booking) => {
        navigate(`${booking.type}/${booking.id}`);
    }


    const handleCancelBooking = (e, bookingId) => {
        e.stopPropagation();
        if (window.confirm('예약을 취소하시겠습니까?')) {
            console.log('예약 취소:', bookingId);
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

    // 캘린더에 예약표시
    const getTileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = date.toISOString().split('T')[0];
            const bookingsOnDate = bookingData.filter(booking => booking.date === dateStr);
            
            if (bookingsOnDate.length > 0) {
                return (
                    <div className="calendar-dot">
                        {bookingsOnDate.map(booking => (
                            <span 
                                key={booking.id} 
                                className={`dot ${booking.type}`}
                            />
                        ))}
                    </div>
                );
            }
        }
    };
    return (
        <>
        <div className="Mypagebox">
            <div className="mypage-header"></div>
            <div className="Mypage-Container">
            <UserInfomation 
                        userInfo={userInfo}
                        loading={loading}
                        error={error}
            />
            </div>
            <div className="myplant">
    <h2>내 예약 목록</h2>
    <div className="mypage-content">
        {/* 왼쪽: 예약 목록 */}
        <div className="mypage-booking-section">
            <div className="mypage-tab-nav">
                <button className={`tab ${activeTab ==='all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}>
                    전체 예약
                </button>
                <button className={`tab ${activeTab === 'camping' ? 'active' : ''}`}
                    onClick={() => setActiveTab('camping')}>
                    캠핑장
                </button>
                <button className={`tab ${activeTab === 'playing' ? 'active' : ''}`}
                    onClick={() => setActiveTab('playing')}>
                    합주실
                </button>
            </div>
            
            <div className="mypage-booking-list">
                {filteredBookings.map((booking) => (
                    <div key={booking.id}
                        onClick={() => handleBookingClick(booking)}
                        className="mypage-booking-item">
                        <div className="mypage-booking-content">
                            <div>
                                <h3 className="mypage-booking-title">{booking.title}</h3>
                                <p className="mypage-booking-date">
                                    <span className="booking-info-label">예약일:</span> {formatDate(booking.date)}
                                    <br />
                                    <span className="booking-info-label">이용시간:</span> {booking.startTime} - {booking.endTime}
                                </p>
                                <p className="mypage-booking-price">
                                    이용 금액: {booking.price}원
                                </p>
                            </div>
                            <div className="mypage-booking-status">
                                <span className={`status ${getStatusStyle(booking.status)}`}>
                                    {getStatusText(booking.status)}
                                </span>
                                {booking.status === 'upcoming' && (
                                    <button
                                        onClick={(e) => handleCancelBooking(e, booking.id)}
                                        className="cancel-btn">
                                        예약 취소
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 오른쪽: 캘린더 */}
        <div className="mypage-calendar">
            <h3 className="mypage-calendar-title">예약 일정</h3>
            <Calendar
                onChange={setDate}
                value={date}
                tileContent={getTileContent}
                className="calendar" />
        </div>
    </div>
</div>
</div>
</>
    );
}