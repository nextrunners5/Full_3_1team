import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../shared/axios/axios';
import { useDispatch } from 'react-redux';  // useDispatch 훅 임포트
import { setOrderUserId } from '../order/orderRedux/slice';
const KakaoCallback = () => {
  const navigate = useNavigate();
  const isProcessingRef = useRef(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const processKakaoLogin = async () => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        const code = new URL(window.location.href).searchParams.get('code');
        
        if (!code) {
          throw new Error('인증 코드가 없습니다.');
        }

        console.log('카카오 인증 코드:', code);

        const response = await axios.post('/api/auth/kakao/callback', { code });

        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem("userId", response.data.user.userId); // 추가
          dispatch(setOrderUserId(response.data.user.userId));
          console.log("카카오 로그인 후 설정된 user_id", response.data.user.userId);
          navigate('/main');  // MainPage로 리다이렉트
        } else {
          throw new Error(response.data.message || '카카오 로그인 실패');
        }
      } catch (error: any) {
        console.error('카카오 로그인 처리 실패:', 
          error.response?.data?.message || error.message);
        navigate('/login');
      } finally {
        isProcessingRef.current = false;
      }
    };

    processKakaoLogin();

    return () => {
      isProcessingRef.current = true;
    };
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      카카오 로그인 처리 중...
    </div>
  );
};

export default KakaoCallback; 