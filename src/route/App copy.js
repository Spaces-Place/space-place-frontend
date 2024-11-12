// App.js
import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginModal from './login';
import FarmList from './farmList';
import RenterMypage from './renter-mypage';
import LesseeMypage from './lessee-mypage';
import FarmDetail from './farmDetail';

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
          <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
            <Container>
              <Navbar.Brand href="/">팜하니?</Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link href="/">팜하니 소개</Nav.Link>
                  <Nav.Link href="/farmList">팜하니</Nav.Link>
                  <Nav.Link href="/farmList">공공텃밭</Nav.Link>
                  <NavDropdown title="농장조회" id="collapsible-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/">서울</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/">강원도</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/">충천도</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/">전라도</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/">경상도</NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link href="/">뭐할까</Nav.Link>
                </Nav>
                <Nav>
                  <Nav.Link href="/LesseeMypage">임대인마이페이지</Nav.Link>
                  <Nav.Link href="/Mypage">임차인마이페이지</Nav.Link>
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

                <div className="animation-container">
                    <div className="floating-shape shape1"></div>
                    <div className="floating-shape shape2"></div>
                    <div className="floating-shape shape3"></div>
                    </div>

        <Routes>
          <Route path="/" element={
            <div>
              <article id="main-con" className="center-style">
                <section className='box'>

                  <div className="our-intro"></div>
                  <div className="animation-container">
                    <div className="back-img"></div>
                    </div>
                </section>
                 <section id="introduce-sec">
                  <div className="farm-img">
                    <div className="farm-intro"></div>
                  </div>
                </section>
                <section id="footer"></section>
              </article>
            </div>
          } />

          <Route path='/farmList' element={<FarmList /> } />
          <Route path='/farmList/:id' element={<FarmDetail />} />
          <Route path='/mypage' element={<RenterMypage />} />
          <Route path='/LesseeMypage' element={<LesseeMypage />} />
        </Routes>
      </div>
  );
}

export default App;
