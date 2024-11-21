// AuthContext.js
import React, { createContext, useEffect, useState } from 'react';
import authService from './authService';
import {useCookies} from 'react-cookie';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'user_type', 'user_id'])
  
  const isAuthenticated = Boolean(cookies.access_token);
  const user = cookies.access_token ? {
    userid : cookies.user_id,
    token: cookies.access_token,
    type: cookies.user_type
  }: null;

  const login = async (userid, password, type) => {
    try {
      const response = await authService.login(userid, password, type);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    removeCookie('access_token', {path: '/'});
    removeCookie('user_type', {path:'/'});
    removeCookie('user_id', {path: '/'});
    authService.setAuthHeader(null);
  };

  useEffect(()=> {
    if(cookies.access_token){
      authService.setAuthHeader(cookies.access_token);
    }
  }, [cookies.access_token]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};