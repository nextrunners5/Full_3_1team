import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../shared/axios/axios';

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isProcessingRef = useRef(false);  // 중복 처리 방지
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    const confirmPayment = async () => {
      // 이미 처리 중이면 중단
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        const response = await axios.post('/payments/confirm', {
          paymentKey,
          orderId,
          amount: Number(amount),
        });

        if (response.data.success) {
          // 결제 성공 처리
          alert('결제가 완료되었습니다.');
          navigate('/order/complete');
        }
      } catch (error: any) {
        console.error('결제 승인 실패:', error);
        navigate('/payments/fail');
      } finally {
        isProcessingRef.current = false;
      }
    };

    if (paymentKey && orderId && amount) {
      confirmPayment();
    }
  }, [location.search, navigate]);  // 의존성 배열 명시

  return (
    <div className="payment-success">
      <h2>결제 처리 중...</h2>
      <p>잠시만 기다려주세요.</p>
    </div>
  );
};

export default PaymentSuccess; 