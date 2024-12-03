import React, { useContext } from 'react';
import { ThemeContext } from '../utils/ThemeContext';
import { AuthContext } from '../utils/AuthContext';  // AuthContext import 추가

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      style={{
        border: "none",
        background: "none", 
        fontSize: "30px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: isAuthenticated ? '10px' : '0'  // 여기를 조건부로 변경
      }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}