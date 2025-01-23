import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import productRoutes from './routes/ProductRoutes'; // ✅ default export로 import
import { setupSwagger } from './config/swagger';

config();
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS 설정
app.use(cors({
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());

// ✅ JSON 요청 허용
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 라우트 적용
app.use('/api', productRoutes); // ✅ '/api' 경로 적용

// ✅ Swagger 적용
setupSwagger(app);

// 기본 라우트 확인
app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📌 Swagger Docs: http://localhost:${PORT}/api-docs`);
});
