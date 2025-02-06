import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FailModal from '../../shared/ui/FailModal';
import "../login/Login.css";

// Define types for the form inputs
interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation

  // State for form inputs
  const [form, setForm] = useState<LoginForm>({
    username: '',
    password: '',
  });

  // State for API call status
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // 에러 메시지 저장
  const [showModal, setShowModal] = useState<boolean>(false); // 모달 상태

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
      }

      const data = await response.json();
      console.log('로그인 성공:', data);
      // Handle successful login (e.g., redirect or update state)
    } catch (error: any) {
      setError(error.message || '로그인 중 문제가 발생했습니다.');
      setShowModal(true); // Show modal on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="l_container">
      <h1 className="l_title">PETOPIA"</h1>
      <h2 className="l_subtitle">로그인</h2>
      <div className="l_box">
        {showModal && (
          <FailModal
            title="로그인 실패"
            message={error || "아이디와 비밀번호를 확인해주세요."} // error 상태 전달
            icon="src/assets/Fail.png"
            onClose={() => setShowModal(false)} // 모달 닫기
          />
        )}
        <form className="l_form" onSubmit={handleSubmit}>
          <input
            className="l_input"
            type="text"
            name="username"
            placeholder="아이디"
            value={form.username}
            onChange={handleInputChange}
          />
          <input
            className="l_input"
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleInputChange}
          />
          <button className="l_button" type="submit" disabled={loading}>
            {loading ? '로딩 중...' : '로그인'}
          </button>
        </form>
        <button className="l_kakao-button">카카오로 간편 로그인/가입</button>
        <button className="l_alternative-button">다른 방법으로 로그인 / 가입</button>
        <div className="l_links">
          <a className="l_link" href="#" onClick={() => navigate('/find-account')}>아이디/비밀번호 찾기</a>
          <a className="l_link" href="#" onClick={() => navigate('/signup')}>회원가입</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
