import { Request } from 'express';

export interface User {
  user_id: string;
  kakao_id?: number;
  name: string;
  email: string;
  phone?: string;
  signup_type: 'local' | 'kakao' | 'naver' | 'google';
  is_active: boolean;
  membership_level: string;
  profile_image?: string;
  isAdmin: boolean;
  point: number;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: string;
      };
    }
  }
} 