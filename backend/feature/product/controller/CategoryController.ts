import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import pool from "../../../config/dbConfig"; // DB 연결 확인

/** 🔹 카테고리 목록 가져오기 */
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const [categories] = await pool.promise().query<RowDataPacket[]>(
      "SELECT category_id, category_name FROM ProductCategories WHERE category_id IS NOT NULL"
    );

    res.status(200).json({ categories });
  } catch (error) {
    console.error("카테고리 불러오기 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};
