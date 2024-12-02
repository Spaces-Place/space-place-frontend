import React, { useContext, useState } from 'react';
import '../styles/login.css';
import authService from '../utils/authService';
import { AuthContext } from '../utils/AuthContext';

const USER_TYPE_LABELS = {
  'consumer': '일반',
  'vendor': '파트너사'  
};

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const { login } = useContext(AuthContext);
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    userid: '',
    name: '',
    password: '',
    email: '',
    phone: '',
    type: 'consumer'
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    e.preventDefault(); // 입력 시에도 URL 변경 방지
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // URL 변경 방지
    setError('');
    setMessage('');
    
    try {
      if (isLoginView) {
        const response = await login(formData.userid, formData.password, formData.type);
        if (response && response.user) {
          onLogin(response.user);
          onClose();
        }
      } else {
        const message = await authService.register(formData);
        setMessage(message);
        setTimeout(() => {
          setIsLoginView(true);
          setFormData(prev => ({
            ...prev,
            name: '',
            email: '',
            phone: '',
          }));
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login_modal">
      <div className="login_modal-con">
        <div className="login_header">
          <h2>{isLoginView ? '로그인' : '회원가입'}</h2>
          <button onClick={onClose} className="login_close-button">X</button>
        </div>
        
        {error && (
          <div className="login_error-message">
            {error}
          </div>
        )}
        {message && (
          <div className="login_success-message">
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login_form" method="POST">
          <div className="login_type-selection">
            {Object.entries(USER_TYPE_LABELS).map(([value, label]) => (
              <button
                type="button"
                key={value}
                className={`login_type-button ${formData.type === value ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setFormData(prev => ({ ...prev, type: value }));
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <input
            type="text"
            name="userid"
            placeholder="User ID"
            value={formData.userid}
            onChange={handleChange}
            className="login_input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="login_input"
            required
          />
          {!isLoginView && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="login_input"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="login_input"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="login_input"
                required
              />
            </>
          )}
          <button type="submit" className="login_submit-button">
            {isLoginView ? '로그인' : '회원가입'}
          </button>
        </form>
        <p className="login_switch-view">
          또는
          <span
            className="login_swap-btn"
            onClick={(e) => {
              e.preventDefault();
              setIsLoginView(!isLoginView);
              setError('');
              setMessage('');
            }}
          >
            {isLoginView ? ' 회원가입' : ' 로그인'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;