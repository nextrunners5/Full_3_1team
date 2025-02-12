import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../shared/axios/axios';
import FailModal from '../../shared/ui/FailModal';
import './FindAccount.css';

const FindAccount: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'id' | 'password'>('id');
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    phone: ''
  });
  const [message, setMessage] = useState('');
  const [showFailModal, setShowFailModal] = useState(false);
  const [failMessage, setFailMessage] = useState('');

  const handleModeChange = (newMode: 'id' | 'password') => {
    setMode(newMode);
    setFormData({
      userId: '',
      email: '',
      phone: ''
    });
    setMessage('');
    setShowFailModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setShowFailModal(false);

    try {
      if (mode === 'id') {
        const response = await axios.post('/auth/find-userid', {
          name: formData.userId,
          email: formData.email,
          phone: formData.phone
        });

        if (response.data.success) {
          setMessage(`찾은 아이디: ${response.data.userId}`);
        }
      } else {
        const response = await axios.post('/auth/reset-password', {
          userId: formData.userId,
          email: formData.email,
          phone: formData.phone
        });

        if (response.data.success) {
          setMessage(`임시 비밀번호: ${response.data.tempPassword}`);
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '처리 중 오류가 발생했습니다.';
      setFailMessage(errorMessage);
      setShowFailModal(true);
      setMessage('');
    }
  };

  return (
    <div className="find-container">
      <h1 className="find-title">아이디/비밀번호 찾기</h1>
      <div className="find-tabs">
        <button
          className={`find-tab ${mode === "id" ? "active" : ""}`}
          onClick={() => handleModeChange("id")}
        >
          아이디 찾기
        </button>
        <button
          className={`find-tab ${mode === "password" ? "active" : ""}`}
          onClick={() => handleModeChange("password")}
        >
          비밀번호 찾기
        </button>
      </div>
      {message && <div className="find-success">{message}</div>}
      <form className="find-form" onSubmit={handleSubmit}>
        {mode === "id" ? (
          <>
            <label className="find-label">
              이름
              <input 
                name="userId" 
                type="text" 
                className="find-input" 
                placeholder="이름을 입력하세요" 
                required 
                onChange={handleChange}
                value={formData.userId} 
              />
            </label>
            <label className="find-label">
              이메일 주소
              <input 
                name="email" 
                type="email" 
                className="find-input" 
                placeholder="이메일 주소를 입력하세요" 
                required 
                onChange={handleChange}
                value={formData.email} 
              />
            </label>
            <label className="find-label">
              휴대폰 번호
              <input 
                name="phone" 
                type="text" 
                className="find-input" 
                placeholder="휴대폰 번호를 입력하세요" 
                required 
                onChange={handleChange}
                value={formData.phone} 
              />
            </label>
          </>
        ) : (
          <>
            <label className="find-label">
              아이디
              <input 
                name="userId" 
                type="text" 
                className="find-input" 
                placeholder="아이디를 입력하세요" 
                required 
                onChange={handleChange}
                value={formData.userId} 
              />
            </label>
            <label className="find-label">
              이메일 주소
              <input 
                name="email" 
                type="email" 
                className="find-input" 
                placeholder="이메일 주소를 입력하세요" 
                required 
                onChange={handleChange}
                value={formData.email} 
              />
            </label>
            <label className="find-label">
              휴대폰 번호
              <input 
                name="phone" 
                type="text" 
                className="find-input" 
                placeholder="휴대폰 번호를 입력하세요" 
                required 
                onChange={handleChange}
                value={formData.phone} 
              />
            </label>
          </>
        )}
        <button type="submit" className="find-button">
          {mode === "id" ? "아이디 찾기" : "비밀번호 찾기"}
        </button>
      </form>
      <div className="find-footer">
        <a className="find-link" onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>로그인하기</a>
        <span className="find-divider">|</span>
        <a className="find-link" onClick={() => navigate('/signup')} style={{ cursor: 'pointer' }}>회원가입</a>
      </div>
      {showFailModal && (
        <FailModal
          title="요청 실패"
          message={failMessage}
          icon="src/assets/Fail.png"
          onClose={() => setShowFailModal(false)}
        />
      )}
    </div>
  );
};

export default FindAccount;
