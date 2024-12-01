import React, { createContext, useEffect, useState } from 'react';
import authService from './authService';
import { useCookies } from 'react-cookie';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['access_token']);
  const [user, setUser] = useState(null);
  const isAuthenticated = Boolean(cookies.access_token);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = cookies.access_token;  // cookies.get 대신 직접 접근
      
      if (storedUser && token && !authService.isTokenExpired(token)) {
        setUser(JSON.parse(storedUser));
        authService.setAuthHeader(token);
      } else {
        logout(); 
      }
    };
    
    initializeAuth();
  }, [cookies.access_token]); // 의존성 배열에 cookies.access_token 추가

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
    removeCookie('access_token', { path: '/' });
    localStorage.removeItem('user');
    setUser(null);
    authService.setAuthHeader(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};