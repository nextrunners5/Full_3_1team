import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express'
import pool from './config/dbConfig';

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

// 오류 처리 미들웨어
app.use((err: Error, req: Request, res: Response, next: NextFunction) => { 
  console.error(err.stack); 
  res.status(500).json({ success: false, message: '서버 오류 발생', error: err.message }); 
});

// MySQL 연결 테스트 (비동기 방식)
const testDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL DB 연결 성공");
    connection.release(); // 연결 해제
  } catch (err) {
    console.error("❌ MySQL DB 연결 실패:", err);
  }
};

// 서버 시작 시 DB 연결 확인
testDB();

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//장바구니 라우트
app.get("/api/cart", (req, res) => {
  res.json([
    { id: "bed", name: "프리미엄 강아지 침대", price: 89000, quantity: 1, image: "/images/bed.png" },
    { id: "brush", name: "프리미엄 브러쉬", price: 32000, quantity: 1, image: "/images/brush.png" }
  ]);
});
