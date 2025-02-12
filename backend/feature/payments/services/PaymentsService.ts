import axios from 'axios';
import { PaymentsRepo } from '../repo/PaymentsRepo';

export class PaymentsService {
  static async confirmPayment(paymentKey: string, orderId: string, amount: number) {
    try {
      console.log('토스페이먼츠 API 호출:', { paymentKey, orderId, amount });

      const response = await axios.post(
        'https://api.tosspayments.com/v1/payments/confirm',
        {
          paymentKey,
          orderId,
          amount,
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.TOSS_SECRET_KEY}:`
            ).toString('base64')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('토스페이먼츠 응답:', response.data);

      if (response.data.status !== 'DONE') {
        throw new Error('결제가 완료되지 않았습니다.');
      }

      // DB에 결제 정보 저장
      await PaymentsRepo.savePayment({
        paymentKey,
        orderId,
        amount,
        status: 'SUCCESS',
        paymentData: response.data
      });

      return response.data;
    } catch (error: any) {
      console.error('토스페이먼츠 API 에러:', error.response?.data || error);
      
      // 에러 응답 구조화
      const errorResponse = {
        success: false,
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code,
        error: error.response?.data || error
      };

      throw errorResponse;
    }
  }
} 