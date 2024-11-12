import React, { useContext, useState } from 'react';
import '../css/login.css';
import authService from './AuthContext/authService';
import { AuthContext } from './AuthContext/AuthContext';

const USER_TYPE_LABELS = {
  'landlord': '사업자',
  'tenant': '일반회원'
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
    type: 'landlord'
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      if (isLoginView) {
        const response = await login(formData.userid, formData.password, formData.type);
        onLogin(response.user);
        onClose();
      } else {
        const message = await authService.register(formData);
        setMessage(message);
        // 회원가입 성공 후 잠시 대기했다가 로그인 화면으로 전환
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
        <div className="login-header">
          <h2>{isLoginView ? '로그인' : '회원가입'}</h2>
          <button onClick={onClose} className="close-button">X</button>
        </div>
        
        {error && (
          <div className="error-message" style={{ color: 'red', margin: '10px 0', textAlign: 'center' }}>
            {error}
          </div>
        )}
        {message && (
          <div className="success-message" style={{ color: 'green', margin: '10px 0', textAlign: 'center' }}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
            <div className="user-type-selection">
              {Object.entries(USER_TYPE_LABELS).map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={`type-button ${formData.type === value ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, type: value }))}
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
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
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
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </>
          )}
          <button type="submit" className="submit-button">
            {isLoginView ? '로그인' : '회원가입'}
          </button>
        </form>
        <p className="switch-view">
          또는
          <span
            className="swap-btn"
            onClick={() => {
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