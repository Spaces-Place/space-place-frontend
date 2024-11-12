// App.js
import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginModal from './route/login';
import CampingList from './route/campingList';
import RenterMypage from './route/renter-mypage';
import LesseeMypage from './route/lessee-mypage';
import CampingDetail from './route/campingDetail';
import CategorySection from './route/category';
import MyMapPage from './route/mapPage';
import ImageCarousel from './route/mainpage'
import PlayingList from './route/playingList';
import PlayingDetail from './route/playingDetail';
import Booking from './route/booking';
import IntroPage from './route/intropage';
import OwnerMypage from './route/owner-mypag';

function App() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsDropdownOpen(false);
  };


  return (
    
      <div className="App">
        <header className="App-header">
          <Navbar collapseOnSelect expand="lg" className="nav-container">
            <Container className="nav-container">
              <Navbar.Brand href="/">Spaces Place</Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/intro">공간소개</Nav.Link>
                  <Nav.Link as={Link} to="/mappage">지도로보자</Nav.Link>
                  <NavDropdown title="공간목록" id="collapsible-nav-dropdown" className="no-dropdown-arrow" >
                    <NavDropdown.Item as={Link} to="/playing">악기연주</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/">파티룸</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/">댄스연습실</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/">노래방</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/">스튜디오</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/camping">캠핑장</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/">헬스장</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/">사무실</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/">숙박</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/">공용주방</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/">스터디룸</NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link as={Link} to="/">뭐할까</Nav.Link>
                </Nav>
                <Nav>
                  <Nav.Link  as={Link} to="/ownerpage">임대인마이페이지</Nav.Link>
                  <Nav.Link  as={Link} to="/Mypage">임차인마이페이지</Nav.Link>
                  <div className="user-btn">
                    {isAuthenticated ? (
                      <div className="login-btn">
                        <button className="dropdown-btn" onClick={toggleDropdown}>
                          {user?.nickname || 'User'} ▼
                        </button>
                        {isDropdownOpen && (
                          <div className="dropdown-content">
                            <NavLink className="nav-link" to="/">마이페이지</NavLink>
                            <button className="nav-link" onClick={handleLogout}>로그아웃</button>
                          </div>
                        )}
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
      <CategorySection />
        </div>
      </>
    } 
  />
  <Route path='/camping' element={<CampingList />} />
  <Route path='/camping/:id' element={<CampingDetail />} />
  <Route path='/mypage' element={<RenterMypage />} />
  <Route path='/LesseeMypage' element={<LesseeMypage />} />
  <Route path='/mappage' element={<MyMapPage /> } />
  <Route path='/playing' element={<PlayingList />} />
  <Route path='/playing/:id' element={<PlayingDetail /> } />
  <Route path='/booking' element={<Booking /> } />
  <Route path='/intro' element={<IntroPage /> } />
  <Route path='/ownerpage' element={<OwnerMypage />} />
</Routes>
</div>

  );
}

export default App;
