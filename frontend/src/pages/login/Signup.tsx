import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../shared/axios/axios';
import FailModal from '../../shared/ui/FailModal';
import './Signup.css';

interface SignupForm {
  userId: string;
  password: string;
  confirmPassword: string;
  name: string;
  email: string;
  phone: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<SignupForm>({
    userId: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isIdChecked, setIsIdChecked] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // ID 검증
    if (!isIdChecked) {
      newErrors.userId = '아이디 중복확인이 필요합니다.';
    }
    if (!/^[a-zA-Z0-9]{6,12}$/.test(form.userId)) {
      newErrors.userId = '아이디는 영문, 숫자 조합 6~12자여야 합니다.';
    }

    // 비밀번호 검증
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(form.password)) {
      newErrors.password = '비밀번호는 영문, 숫자, 특수문자 조합 8~20자여야 합니다.';
    }

    // 비밀번호 확인
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    // 이름 검증
    if (!form.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    // 이메일 검증
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 전화번호 검증
    if (!/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/.test(form.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'userId') {
      setIsIdChecked(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('/api/auth/signup', {
        email: form.email,
        password: form.password,
        name: form.name,
        phone: form.phone
      });

      if (response.data.success) {
        setModalMessage('회원가입이 완료되었습니다.');
        setShowModal(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setModalMessage(apiError.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
      setShowModal(true);
    }
  };

  const handleIdCheck = async () => {
    try {
      const response = await axios.get(`/api/auth/check-userid/${form.userId}`);
      if (response.data.success) {
        setIsIdChecked(true);
        setModalMessage('사용 가능한 아이디입니다.');
        setShowModal(true);
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setModalMessage(apiError.response?.data?.message || '이미 사용 중인 아이디입니다.');
      setShowModal(true);
    }
  };

  const checkEmailDuplicate = async () => {
    try {
      const response = await axios.post('/api/auth/check-email', { email: form.email });
      if (response.data.success) {
        setIsIdChecked(true);
        setModalMessage('사용 가능한 이메일입니다.');
        setShowModal(true);
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setModalMessage(apiError.response?.data?.message || '이미 사용 중인 이메일입니다.');
      setShowModal(true);
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">회원가입</h1>
      <p className="signup-subtitle">PETOPIA의 회원이 되어주세요</p>

      {showModal && (
        <FailModal
          title={modalMessage.includes('실패') ? '오류' : '알림'}
          message={modalMessage}
          icon="src/assets/Fail.png"
          onClose={() => setShowModal(false)}
        />
      )}

      <form onSubmit={handleSignup} className="signup-form">
        <div className="form-group">
          <label htmlFor="userId">아이디</label>
          <div className="input-with-btn">
            <input
              type="text"
              id="userId"
              name="userId"
              value={form.userId}
              onChange={handleInputChange}
              placeholder="영문, 숫자 조합 6~12자"
            />
            <button type="button" onClick={handleIdCheck} className="check-btn">
              중복확인
            </button>
          </div>
          {errors.userId && <span className="error-text">{errors.userId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleInputChange}
            placeholder="영문, 숫자, 특수문자 조합 8~20자"
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleInputChange}
            placeholder="비밀번호를 다시 입력해주세요"
          />
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="이름을 입력해주세요"
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            placeholder="이메일 주소를 입력해주세요"
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">휴대폰 번호</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            placeholder="예) 010-0000-0000"
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        <button type="submit" className="submit-btn">가입하기</button>
      </form>

      <div className="login-link">
        이미 회원이신가요? <a href="/login">로그인하기</a>
      </div>
    </div>
  );
};

export default Signup;
