import { Request } from 'express';

// JWT 토큰에서 추출되는 최소한의 사용자 정보 타입
export interface TokenUser {
  user_id: string;
  email: string;
}

// 전체 사용자 정보 타입
export interface User extends TokenUser {
  kakao_id?: number;
  name: string;
  phone?: string;
  signup_type: 'local' | 'kakao' | 'naver' | 'google';
  is_active: boolean;
  membership_level: string;
  profile_image?: string;
  isAdmin: boolean;
  point: number;
}

// 인증된 요청에서 사용할 타입
export interface AuthenticatedRequest extends Request {
  user?: TokenUser;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenUser;
    }
  }
} 