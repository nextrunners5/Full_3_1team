import express from "express";
import { createQuestion } from "../feature/qna/controller/QnaController";

const router = express.Router();

// 상품 QnA 등록 API
router.post("/questions", createQuestion);

export default router;
