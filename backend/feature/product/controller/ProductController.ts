import { Request, Response } from "express";
import pool from "../../../config/dbConfig";
import ProductImage from "../img/ProductImage"
import { ResultSetHeader } from "mysql2";


export const getProductById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const [rows] = await pool.promise().query(
      "SELECT * FROM Products WHERE product_id = ?",
      [id]
    );

    const result = rows as any[];

    if (result.length === 0) {
      res.status(404).json({ message: "상품을 찾을 수 없습니다." });
      return;
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("상품 조회 실패:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  let { ids, userId } = req.query;

  try {
    if (!ids) {
      res.status(400).json({ message: "상품 ID가 필요합니다." });
    }

    const idArray = (typeof ids === "string" ? ids.split(",").map(Number) : []);

    const [products] = await pool.promise().query(
      `SELECT p.*
        FROM Products p
        JOIN WishList w ON p.product_id = w.product_id
        WHERE w.user_id = ?
        AND w.like_status = TRUE`, 
      [userId, ...idArray]
    );
    res.status(200).json(products);
  } catch (error) {
    console.error("상품 조회 실패:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: [any[], any] = await pool.promise().query("SELECT * FROM Categories");

    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(404).json({ message: "카테고리가 없습니다." });
      return;
    }

    console.log("카테고리 API 응답:", rows);
    res.status(200).json({ categories: rows });
  } catch (error) {
    console.error("카테고리 조회 실패:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const { productId } = req.params;
  const updatedData = req.body;

  console.log("백엔드 디버그 수정 요청 수신");
  console.log("백엔드 디버그 수정 요청된 상품 ID:", productId);
  console.log("백엔드 디버그 수정 요청 데이터:", updatedData);

  if (!productId) {
      res.status(400).json({ message: "상품 ID가 제공되지 않았습니다." });
      return;
  }

  try {
      const [result] = await pool.promise().query<ResultSetHeader>(
          "UPDATE Products SET ? WHERE product_id = ?",
          [updatedData, productId]
      );

      if (result.affectedRows === 0) {
          res.status(404).json({ message: "해당 상품을 찾을 수 없습니다." });
          return;
      }

      res.status(200).json({ message: "상품이 성공적으로 수정되었습니다." });
  } catch (error) {
      console.error("상품 수정 실패:", error);
      res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const { productId } = req.params;

  try {
    const [productRows] = await pool
      .promise()
      .query("SELECT * FROM Products WHERE product_id = ?", [productId]);

    if (!productRows || (productRows as any[]).length === 0) {
      res.status(404).json({ message: "해당 상품을 찾을 수 없습니다." });
      return;
    }

    await pool.promise().query("DELETE FROM Products WHERE product_id = ?", [productId]);

    res.status(200).json({ message: "상품이 삭제되었습니다." });
  } catch (error) {
    console.error("상품 삭제 실패:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};