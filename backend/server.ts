import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import { setupSwagger } from './config/swagger'; // Swagger 설정 불러오기

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors({
  origin: "*",
  methods: ['GET', 'PUT', 'POST', 'DELETE'],  
  allowedHeaders: ['Content-Type', 'Authorization']  
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger 설정 적용
setupSwagger(app);

// 기본 라우트
app.get('/', (req, res) => { 
  res.send('Hello, TypeScript with Express!'); 
}); 

// 오류 처리 미들웨어
app.use((err: Error, req: Request, res: Response, next: NextFunction) => { 
  console.error(err.stack); 
  res.status(500).json({ success: false, message: '서버 오류 발생', error: err.message }); 
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`); // Swagger 문서 경로 출력
});
