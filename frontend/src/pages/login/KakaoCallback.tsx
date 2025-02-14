import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../shared/axios/axios';

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const processKakaoLogin = async () => {
      const code = new URL(window.location.href).searchParams.get('code');
      
      try {
        const response = await axios.post('/api/auth/kakao/callback', { code });
        console.log('카카오 로그인 응답:', response.data);
        
        if (response.data.token) {
          localStorage.setItem('token', `Bearer ${response.data.token}`);
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
          navigate('/');
        } else {
          throw new Error('토큰이 없습니다.');
        }
      } catch (error) {
        console.error('카카오 로그인 실패:', error);
        navigate('/login');
      }
    };

    processKakaoLogin();
  }, [navigate]);

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoCallback; 