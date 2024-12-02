import React, { useState, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

// 페이지 컴포넌트
import LoginModal from './pages/login';
import RenterMypage from './pages/renter-mypage';
import CategorySection from './pages/category';
import MyMapPage from './pages/myMapPage';
import ImageCarousel from './pages/mainpage';
import Booking from './pages/booking';
import IntroPage from './pages/intropage';
import OwnerMypage from './pages/owner-mypag';
import SpaceList from './pages/spaceList';
import SpaceDetail from './pages/spaceDetail';
import SearchResults from './pages/searchResults';
import NotFound from './pages/notFound';
import Contact from './pages/contact';
import Settings from './pages/Settings';

// 컨텍스트 및 상수
import { AuthContext } from './utils/AuthContext';
import { ThemeContext } from './utils/ThemeContext';
import { SearchContext } from './utils/SearchContext';
import ItemType from './constants/type/ItemType';

// 컴포넌트
import ScrollToTop from './components/ScrollToTop';
import LoadingSpinner from './components/LoadingSpinner';
import SearchBar from './components/SearchBar';
import ThemeToggle from './components/ThemeToggle';
import PaymentResult from './pages/PaymentResult';

// 보호된 라우트 컴포넌트
const PrivateRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole && user?.type !== requiredRole) {
    toast.error('접근 권한이 없습니다.');
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // 초기 데이터 로딩
    const initializeApp = async () => {
      try {
        // 사용자 세션 확인
        // 알림 데이터 로드
        // 기타 초기화 작업
        setIsLoading(false);
      } catch (error) {
        console.error('초기화 중 오류:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleLogin = async (userData) => {
    try {
      // 로그인 처리
      setIsLoginModalOpen(false);
      toast.success('로그인되었습니다.');
    } catch (error) {
      toast.error('로그인 중 오류가 발생했습니다.');
    }
  };

  const handleLogout = () => {
    logout();
    toast.info('로그아웃되었습니다.');
    setTimeout(() => {
      window.location.href = '/';
    }, 2000)
   
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    // 검색 처리
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`App ${theme}`}>
  <Helmet>
  <title>Space Place</title>
  <link rel="shortcut icon" href="/helmet.png" />
  <link rel="icon" type="image/png" href="/helmet.png" />
</Helmet>
      <header className="App-header">
        <Navbar collapseOnSelect expand="lg" className="nav-container">
          <Container className="nav-container">
            <Navbar.Brand href="/">Spaces Place</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/intro">공간소개</Nav.Link>
                <Nav.Link as={Link} to="/mappage">지도로보자</Nav.Link>
                <NavDropdown title="공간목록" id="collapsible-nav-dropdown" className="no-dropdown-arrow">
                  {ItemType.map(({type, title, to}) => (
                    <NavDropdown.Item
                      key={type}
                      as={Link}
                      to={to}
                      type={type}
                    >{title}</NavDropdown.Item>
                  ))}
                </NavDropdown>
                <Nav.Link as={Link} to="/contact">문의하기</Nav.Link>
              </Nav>
              
              <Nav className="ms-auto">
                <ThemeToggle />
                {/* {isAuthenticated && <NotificationBell notifications={notifications} />} */}
                
                <div className="user-btn">
                  {isAuthenticated ? (
                    <div className="login-btn">
                      <NavDropdown 
                        title={user?.userid || 'User'} 
                        id="user-dropdown"
                        align="end"
                      >
                        {user?.type === 'consumer' && (
                          <NavDropdown.Item as={Link} to="/mypage">마이페이지</NavDropdown.Item>
                        )}
                        {user?.type === 'vendor' && (
                          <NavDropdown.Item as={Link} to="/ownerpage">점주페이지</NavDropdown.Item>
                        )}
                        <NavDropdown.Item as={Link} to="/settings">설정</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={handleLogout}>로그아웃</NavDropdown.Item>
                      </NavDropdown>
                    </div>
                  ) : (
                    <button onClick={() => setIsLoginModalOpen(true)}>로그인</button>
                  )}
                </div>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      <ScrollToTop />

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

<Routes>
        <Route 
          path="/" 
          element={
            <>
              <ImageCarousel />
              <div className="p-4">
              <SearchBar onSearch={handleSearch} />
                <CategorySection />
              </div>
            </>
          } 
        />

        {/* 공개 라우트 */}
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/mappage" element={<MyMapPage />} />
        <Route path="/search" element={<SearchResults query={searchQuery} />} />

        {/* 공간 관련 라우트 */}
        {ItemType.map(({type}) => (
          <Route key={type} path={`/space/${type}`} element={<SpaceList type={type}/>} />
        ))}
        {ItemType.map(({type}) => (
          <Route key={`${type}-detail`} path={`/space/${type}/:id`} element={<SpaceDetail type={type}/>} />
        ))}

        {/* 보호된 라우트 */}
        <Route path="/mypage" element={
          <PrivateRoute requiredRole="consumer">
            <RenterMypage />
          </PrivateRoute>
        } />
        <Route path="/ownerpage" element={
          <PrivateRoute requiredRole="vendor">
            <OwnerMypage />
          </PrivateRoute>
        } />
        <Route path="/booking" element={
          <PrivateRoute>
            <Booking />
          </PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        } />

        {/* 결제 결과 처리 라우트 */}
        <Route path="/payment/success" element={
          <PrivateRoute>
            <PaymentResult type="success" />
          </PrivateRoute>
        } />
        <Route path="/payment/cancel" element={
          <PrivateRoute>
            <PaymentResult type="cancel" />
          </PrivateRoute>
        } />
        <Route path="/payment/fail" element={
          <PrivateRoute>
            <PaymentResult type="fail" />
          </PrivateRoute>
        } />

        {/* 404 페이지 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer 
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ marginTop: "80px" }}  // 상단 여백 추가 (원하는 픽셀값으로 조정 가능)
      />
    </div>
  );
}

export default App;