import React, { useContext, useState } from 'react';
import { ThemeContext } from '../utils/ThemeContext';
import { AuthContext } from '../utils/AuthContext';
import '../styles/Settings.css';

const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false
  });

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="settings-container">
      <h1>설정</h1>
      
      <section className="settings-section">
        <h2>테마 설정</h2>
        <div className="theme-setting">
          <label>다크 모드</label>
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
          </button>
        </div>
      </section>

      <section className="settings-section">
        <h2>알림 설정</h2>
        <div className="notification-settings">
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() => handleNotificationChange('email')}
              />
              이메일 알림
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={() => handleNotificationChange('push')}
              />
              푸시 알림
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={notifications.marketing}
                onChange={() => handleNotificationChange('marketing')}
              />
              마케팅 정보 수신
            </label>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h2>계정 정보</h2>
        <div className="account-info">
          <p><strong>사용자 ID:</strong> {user?.userid}</p>
          <p><strong>계정 유형:</strong> {user?.type === 'consumer' ? '일반 사용자' : '공간 제공자'}</p>
        </div>
      </section>
    </div>
  );
};

export default Settings;