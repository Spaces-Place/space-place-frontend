import React, { useContext } from 'react';
import { ThemeContext } from '../utils/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

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
        marginTop: '10px'

      }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}