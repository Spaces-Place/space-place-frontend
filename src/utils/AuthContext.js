// AuthContext.js
import React, { createContext, useEffect, useState } from 'react';
import authService from './authService';
import {useCookies} from 'react-cookie';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['access_token']);
  const [user, setUser] = useState(null);
  
  const isAuthenticated = Boolean(cookies.access_token);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (userid, password, type) => {
    try {
      const response = await authService.login(userid, password, type);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    // 쿠키에서 토큰 제거
    removeCookie('access_token', {path: '/'});
    
    // 로컬 스토리지에서 사용자 정보 제거
    localStorage.removeItem('user');
    
    // 상태 초기화
    setUser(null);
    authService.setAuthHeader(null);
  };

  useEffect(() => {
    if(cookies.access_token) {
      authService.setAuthHeader(cookies.access_token);
    }
  }, [cookies.access_token]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};