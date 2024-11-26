// components/NotificationBell.js
import React, { useState } from 'react';

export default function NotificationBell({ notifications = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="notification-container">
      <button className="bell-button" onClick={() => setIsOpen(!isOpen)}>
        🔔
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </button>
      
      {isOpen && (
        <div className="notification-dropdown">
          {notifications.length === 0 ? (
            <p className="no-notifications">알림이 없습니다</p>
          ) : (
            notifications.map((notification, index) => (
              <div key={index} className="notification-item">
                {notification.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}