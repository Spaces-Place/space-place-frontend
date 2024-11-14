// App.js
import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginModal from './pages/login';
import RenterMypage from './pages/renter-mypage';
import CategorySection from './pages/category';
import MyMapPage from './pages/mapPage';
import ImageCarousel from './pages/mainpage'
import Booking from './pages/booking';
import IntroPage from './pages/intropage';
import OwnerMypage from './pages/owner-mypag';
import SpaceList from './pages/spaceList';
import SpaceDetail from './pages/spaceDetail';
import ItemType from './constants/type/ItemType';



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
                    {ItemType.map(({type, title, to}) => (
                      <NavDropdown.Item
                      key={type}
                      as={Link}
                      to={to}
                      type={type}
                      >{title}</NavDropdown.Item>
                    ))}
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

  {ItemType.map(({type}) => (
    <Route key={type} path={`/${type}`} element={<SpaceList type={type}/>} />
  ))}

  {ItemType.map(({type}) => (
    <Route key={`${type}-detail`} path={`/${type}/:id`} element={<SpaceDetail type={type}/>} />
  ))}

  <Route path='/mypage' element={<RenterMypage />} />
  <Route path='/mappage' element={<MyMapPage /> } />
  <Route path='/booking' element={<Booking /> } />
  <Route path='/intro' element={<IntroPage /> } />
  <Route path='/ownerpage' element={<OwnerMypage />} />
</Routes>
</div>

  );
}

export default App;
