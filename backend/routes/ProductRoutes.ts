//컨트롤러는 사용자로부터의 요청을 받아서 처리하고, 적절한 응답을 반환하는 역할을 합니다. 
//비즈니스 로직을 서비스 계층에 위임하고, 서비스로부터 받은 결과를 클라이언트에 반환합니다.

import express, { Router, Request, Response } from "express";
import pool from "../../backend/config/dbConfig";
import ProductService from "../../backend/feature/product/services/ProductService";
import { RowDataPacket } from "mysql2";

const router = Router();

// 모든 카테고리 조회 API
router.get("/categories", async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.promise().query<RowDataPacket[]>(
      "SELECT category_id, category_name FROM ProductCategories"
    );
    res.json(rows);
  } catch (error) {
    console.error("카테고리 목록 불러오기 실패:", error);
    res.status(500).json({ message: "서버 오류: 카테고리 목록을 불러올 수 없습니다." });
  }
});

// 상품 등록 API
router.post("/", async (req: Request, res: Response) => {
  try {
    const newProduct = await ProductService.createProduct(req.body);
    res.status(201).json({ message: "상품 등록 성공", product: newProduct });
  } catch (error) {
    console.error("상품 등록 실패:", error);
    res.status(500).json({ message: "서버 오류: 상품을 등록할 수 없습니다." });
  }
});

// 상품 목록 조회 API
router.get("/", async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.promise().query<RowDataPacket[]>("SELECT * FROM Products");
    res.json(rows);
  } catch (error) {
    console.error("상품 데이터를 불러오는 중 오류 발생:", error);
    res.status(500).json({ message: "서버 내부 오류" });
  }
});

// 상품 상세 조회 API
router.get(
  "/:product_id",
  async (req: Request<{ product_id: string }>, res: Response): Promise<void> => {
    try {
      const { product_id } = req.params;
      console.log("요청된 product_id:", product_id); // 디버깅

      // 숫자로 변환 후 유효성 검사
      const id = parseInt(product_id, 10);
      if (isNaN(id)) {
        console.error("잘못된 상품 ID:", product_id);
        res.status(400).json({ message: "잘못된 상품 ID입니다." });
        return;
      }

      // MySQL 조회 쿼리 실행
      const [rows] = await pool
        .promise()
        .query<RowDataPacket[]>("SELECT * FROM Products WHERE product_id = ?", [id]);

      console.log("조회된 데이터:", rows); // 디버깅

      if (!rows || rows.length === 0) {
        res.status(404).json({ message: "해당 상품을 찾을 수 없습니다." });
        return;
      }

      res.json(rows[0]);
    } catch (error) {
      console.error("상품 데이터를 불러오는 중 오류 발생:", error);
      res.status(500).json({ message: "서버 내부 오류" });
    }
  }
);



export default router;
