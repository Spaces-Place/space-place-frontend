import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // 로컬 스토리지에서 저장된 테마 가져오기
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    // 테마 변경 시 로컬 스토리지에 저장
    localStorage.setItem('theme', theme);
    // HTML 요소에 테마 클래스 적용
    document.documentElement.setAttribute('data-theme', theme);
    // body에도 테마 클래스 적용
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Provider 값으로 theme 상태와 토글 함수 제공
  const value = {
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};