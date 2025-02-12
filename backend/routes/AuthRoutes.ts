import express from 'express';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

// 타입 안전한 비동기 핸들러
const asyncHandler = (handler: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// 회원가입
router.post('/signup', asyncHandler(async (req, res) => {
  const { signup } = await import('../feature/auth/controller/AuthController');
  await signup(req, res);
}));

// 아이디 중복 체크
router.get('/check-userid/:userId', asyncHandler(async (req, res) => {
  const { checkUserId } = await import('../feature/auth/controller/AuthController');
  await checkUserId(req, res);
}));

// 로그인
router.post('/login', asyncHandler(async (req, res) => {
  const { login } = await import('../feature/auth/controller/AuthController');
  await login(req, res);
}));

// 로그아웃
router.post('/logout', asyncHandler(async (req, res) => {
  const { logout } = await import('../feature/auth/controller/AuthController');
  await logout(req, res);
}));

// 카카오 로그인 콜백
router.post('/kakao/callback', asyncHandler(async (req, res) => {
  const { kakaoCallback } = await import('../feature/auth/controller/AuthController');
  await kakaoCallback(req, res);
}));

// 아이디 찾기
router.post('/find-userid', asyncHandler(async (req, res) => {
  const { findUserId } = await import('../feature/auth/controller/AuthController');
  await findUserId(req, res);
}));

// 비밀번호 재설정
router.post('/reset-password', asyncHandler(async (req, res) => {
  const { resetPassword } = await import('../feature/auth/controller/AuthController');
  await resetPassword(req, res);
}));

export default router;
