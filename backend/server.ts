import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express'
import ProductRoutes from "../backend/routes/ProductRoutes";
import QnARoutes from "../backend/routes/QnARoutes";
import OrderRoutes from "../backend/routes/OrderRoutes";
import WishlistRoutes from "../backend/routes/WishlistRoutes";
import CategoryRoutes from "../backend/routes/CategoryRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors({
  origin: "*",
  methods: ['GET', 'PUT', 'POST', 'DELETE'],  // 허용할 메서드
  allowedHeaders: ['Content-Type', 'Authorization']  // 허용할 헤더
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//기본 라우트
app.get('/', (req, res) => { 
  res.send('Hello, TypeScript with Express!'); 
}); 

// product 라우트
app.use("/api/products", ProductRoutes);
app.use("/api/qna", QnARoutes);
app.use("/api/wishlist", WishlistRoutes);
app.use("/api/categories", CategoryRoutes);

// 주문 라우터
app.use("/api/orders", OrderRoutes);

// 오류 처리 미들웨어
app.use((err: Error, req: Request, res: Response, next: NextFunction) => { 
  console.error(err.stack); 
  res.status(500).json({ success: false, message: '서버 오류 발생', error: err.message }); 
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});