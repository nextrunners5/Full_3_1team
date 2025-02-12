import { config } from "dotenv";
config();
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import ProductRoutes from "../backend/routes/ProductRoutes";
import QnARoutes from "../backend/routes/QnARoutes";
import OrderRoutes from "../backend/routes/OrderRoutes";
import WishlistRoutes from "../backend/routes/WishlistRoutes";
import CategoryRoutes from "../backend/routes/CategoryRoutes";
import CartRoutes from "../backend/routes/CartRoutes";
import productImageRoutes from "../backend/routes/ProductImageRoutes";
import ProductImageUplordRoutes from "../backend/routes/ProductImageUplordRoutes";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // 프론트엔드 주소
    credentials: true, // 쿠키 전송을 위해 필요
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth 라우터 설정
const authRouter = express.Router();

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

authRouter.post('/signup', asyncHandler(async (req, res) => {
  const { signup } = await import('./feature/auth/controller/AuthController');
  await signup(req, res);
}));

authRouter.get('/check-userid/:userId', asyncHandler(async (req, res) => {
  const { checkUserId } = await import('./feature/auth/controller/AuthController');
  await checkUserId(req, res);
}));

authRouter.post('/login', asyncHandler(async (req, res) => {
  const { login } = await import('./feature/auth/controller/AuthController');
  await login(req, res);
}));

authRouter.post('/logout', asyncHandler(async (req, res) => {
  const { logout } = await import('./feature/auth/controller/AuthController');
  await logout(req, res);
}));

authRouter.post('/kakao/callback', asyncHandler(async (req, res) => {
  const { kakaoCallback } = await import('./feature/auth/controller/AuthController');
  await kakaoCallback(req, res);
}));

// 아이디/비밀번호 찾기 라우트 추가
authRouter.post('/find-userid', asyncHandler(async (req, res) => {
  const { findUserId } = await import('./feature/auth/controller/AuthController');
  await findUserId(req, res);
}));

authRouter.post('/reset-password', asyncHandler(async (req, res) => {
  const { resetPassword } = await import('./feature/auth/controller/AuthController');
  await resetPassword(req, res);
}));

// Auth 라우터 등록
app.use('/api/auth', authRouter);

// 기존 라우터들...
app.use("/api/products", ProductRoutes);
app.use("/api/qna", QnARoutes);
app.use("/api/orders", OrderRoutes);
app.use("/api/wishlist", WishlistRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/carts", CartRoutes);
app.use("/api", productImageRoutes);
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// 오류 처리 미들웨어
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: "서버 오류 발생", 
    error: err.message 
  });
});

// MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB 연결 성공"))
  .catch((err) => console.error("MongoDB 연결 실패:", err));

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
