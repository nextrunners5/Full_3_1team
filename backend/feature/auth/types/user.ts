import { Request } from 'express';

interface TokenUser {
  user_id: string;
  email: string;
  nickname?: string;
  signup_type?: string;
}

// Express의 Request.user를 위한 타입
interface RequestUser extends Express.User, TokenUser {}

// 전체 사용자 정보 타입
export interface User extends TokenUser {
  kakao_id?: number;
  name: string;
  phone?: string;
  is_active: boolean;
  membership_level: string;
  profile_image?: string;
  isAdmin: boolean;
  point: number;
}

// 인증된 요청에서 사용할 타입
interface AuthenticatedRequest extends Request {
  user?: TokenUser;
}

// Express의 Request.user를 위한 타입 확장
declare global {
  namespace Express {
    // User 인터페이스 확장
    interface User extends TokenUser {}
  }
}

export { TokenUser, AuthenticatedRequest }; 
