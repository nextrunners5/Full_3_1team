import { Request, Response } from "express";
import dbConfig from "../../../config/dbConfig";

export const createQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(" 요청 데이터:", req.body);

    let { user_id, product_id, question_detail, question_date, question_private } = req.body;

    if (!product_id || !question_detail || !question_date) {
      console.error(" 필수 입력값 누락:", { product_id, question_detail, question_date });
      res.status(400).json({ message: "필수 입력값이 누락되었습니다." });
      return;
    }

    // user_id가 없으면 자동으로 "guest"로 설정
    if (!user_id) {
      user_id = "guest";
    }

    const sql = `
      INSERT INTO Question (user_id, product_id, question_detail, question_date, question_private)
      VALUES (?, ?, ?, ?, ?);
    `;
    const values = [user_id, product_id, question_detail, question_date, question_private];

    console.log(" SQL 실행 값:", values);

    const result: any = await dbConfig.promise().query(sql, values);
    
    console.log(" DB Insert 결과:", result);

    res.status(201).json({ message: "Question created successfully", question_id: result.insertId });
  } catch (error) {
    console.error(" QnA 질문 등록 오류:", error);
    res.status(500).json({ message: "서버 오류 발생", error});
  }
};
