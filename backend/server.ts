import { config } from "dotenv";
config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import ProductRoutes from "../backend/routes/ProductRoutes";
import QnARoutes from "../backend/routes/QnARoutes";
import OrderRoutes from "../backend/routes/OrderRoutes";
import WishlistRoutes from "../backend/routes/WishlistRoutes";
import CategoryRoutes from "../backend/routes/CategoryRoutes";
import productImageRoutes from "../backend/routes/ProductImageRoutes";
import ProductImageUplordRoutes from "../backend/routes/ProductImageUplordRoutes";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE"], // 허용할 메서드
    allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//기본 라우트
app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Express!");
});

// product 라우트
app.use("/api", ProductRoutes);
app.use("/api", CategoryRoutes);
app.use("/api", WishlistRoutes);
app.use("/api/qna", QnARoutes);
// 이미지 업로드
app.use("/api/productImages", ProductImageUplordRoutes);
// 이미지 API 
app.use("/api", productImageRoutes);
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// 주문 라우터
app.use("/api/orders", OrderRoutes);

// 오류 처리 미들웨어
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ success: false, message: "서버 오류 발생", error: err.message });
});

// Mongo DB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB 연결 성공"))
  .catch((err) => console.error("MongoDB 연결 실패:", err));

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
