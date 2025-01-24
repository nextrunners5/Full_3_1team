import express from "express";
import pool from "../config/dbConfig";
import ProductService from "../feature/product/services/ProductService";

const router = express.Router();

// 모든 카테고리 조회 API (Promise 기반)
router.get("/categories", async (req, res) => {
  try {
    const [results] = await pool.promise().query("SELECT category_id, category_name FROM ProductCategories");
    res.json(results);
  } catch (error) {
    console.error("카테고리 목록 불러오기 실패:", error);
    res.status(500).json({ message: "서버 오류: 카테고리 목록을 불러올 수 없습니다." });
  }
});

// 상품 등록 API
router.post("/products", async (req, res) => {
  try {
    const newProduct = await ProductService.createProduct(req.body);
    res.status(201).json({ message: "상품 등록 성공", product: newProduct });
  } catch (error) {
    console.error("상품 등록 실패:", error);
    res.status(500).json({ message: "서버 오류: 상품을 등록할 수 없습니다." });
  }
});

// 상품 조회 API
router.get("/products", async (req, res) => {
  try {
    const [results] = await pool.promise().query("SELECT * FROM Products");
    res.json(results);
  } catch (error) {
    console.error(" 상품 데이터를 불러오는 중 오류 발생:", error);
    res.status(500).json({ message: "서버 내부 오류" });
  }
});

export default router;
