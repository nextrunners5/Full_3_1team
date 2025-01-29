import React, { useState } from 'react';
import './Signup.css';

function Signup() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!/^[a-zA-Z0-9]{6,12}$/.test(userId)) {
      newErrors.userId = '아이디는 영문, 숫자 조합 6~12자여야 합니다.';
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(password)) {
      newErrors.password = '비밀번호는 영문, 숫자, 특수문자 조합 8~20자여야 합니다.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;
    
    console.log('회원가입 데이터:', { userId, password, name, email, phone });
    alert('회원가입 요청이 준비되었습니다. 백엔드 연동 필요!');
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">회원가입</h1>
      <p className="signup-subtitle">PETOPIA의 회원이 되어주세요</p>

      <form onSubmit={handleSubmit} className="signup-form">
        {/* 아이디 */}
        <div className="form-group">
          <label htmlFor="userId">아이디</label>
          <div className="input-with-btn">
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="영문, 숫자 조합 6~12자"
              required
            />
            <button type="button" className="check-btn">중복확인</button>
          </div>
          {errors.userId && <span className="error-text">{errors.userId}</span>}
        </div>

        {/* 비밀번호 */}
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="영문, 숫자, 특수문자 조합 8~20자"
            required
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        {/* 비밀번호 확인 */}
        <div className="form-group">
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호를 다시 입력해주세요"
            required
          />
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
        </div>

        {/* 이름 */}
        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해주세요"
            required
          />
        </div>

        {/* 이메일 */}
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 주소를 입력해주세요"
            required
          />
        </div>

        {/* 휴대폰 번호 */}
        <div className="form-group">
          <label htmlFor="phone">휴대폰 번호</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="예) 010-0000-0000"
            required
          />
        </div>

        <button type="submit" className="submit-btn">가입하기</button>
      </form>

      <div className="login-link">이미 회원이신가요? <a href="/login">로그인하기</a></div>
    </div>
  );
}

export default Signup;
