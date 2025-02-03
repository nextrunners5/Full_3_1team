import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import pool from "../../../config/dbConfig"; // MySQL 연결

/**  위시리스트 조회 */
export const getWishlist = async (req: Request, res: Response): Promise<void> => {
  let { userId } = req.query as { userId: string };

  try {
    if (!userId) {
      res.status(400).json({ message: "userId가 필요합니다." });
      return;
    }

    // userId가 DB에 존재하는지 확인
    const [userRows] = await pool.promise().query<RowDataPacket[]>(
      "SELECT user_id FROM Users WHERE user_id = ?",
      [userId]
    );

    // user_id가 없으면 guest로 처리
    if (userRows.length === 0) {
      userId = "guest";
    }

    // guest 사용자는 빈 배열 반환
    if (userId === "guest") {
      res.status(200).json({ wishlist: [] });
      return;
    }

    // 위시리스트 조회
    const [wishlistRows] = await pool.promise().query<RowDataPacket[]>(
      "SELECT product_id FROM WishList WHERE user_id = ?",
      [userId]
    );

    const wishlist = wishlistRows.map((row) => row.product_id);
    res.status(200).json({ wishlist });
  } catch (error) {
    console.error("위시리스트 조회 오류:", error);
    res.status(500).json({ message: "위시리스트 조회 실패" });
  }
};

/**  위시리스트 추가 */
export const addToWishlist = async (req: Request, res: Response): Promise<void> => {
  const { userId, productId } = req.body;

  try {
    if (!userId || !productId) {
      res.status(400).json({ message: "userId와 productId가 필요합니다." });
      return;
    }

    // 회원 여부 확인
    const [userRows] = await pool.promise().query<RowDataPacket[]>(
      "SELECT user_id FROM Users WHERE user_id = ?",
      [userId]
    );

    if (userRows.length === 0) {
      res.status(403).json({ message: "비회원은 위시리스트를 저장할 수 없습니다." });
      return;
    }

    // 위시리스트 추가 (이미 존재하면 무시)
    await pool.query(
      "INSERT IGNORE INTO WishList (user_id, product_id) VALUES (?, ?)",
      [userId, productId]
    );

    res.status(201).json({ message: "위시리스트에 추가되었습니다." });
  } catch (error) {
    console.error("위시리스트 추가 오류:", error);
    res.status(500).json({ message: "위시리스트 추가 실패" });
  }
};

/**  위시리스트 삭제 */
export const removeFromWishlist = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body;
  const { productId } = req.params;

  try {
    if (!userId || !productId) {
      res.status(400).json({ message: "userId와 productId가 필요합니다." });
      return;
    }

    // 회원 여부 확인
    const [userRows] = await pool.promise().query<RowDataPacket[]>(
      "SELECT user_id FROM Users WHERE user_id = ?",
      [userId]
    );

    if (userRows.length === 0) {
      res.status(403).json({ message: "비회원은 위시리스트를 삭제할 수 없습니다." });
      return;
    }

    // 위시리스트에서 삭제
    await pool.promise().query(
      "DELETE FROM WishList WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    res.status(200).json({ message: "위시리스트에서 제거되었습니다." });
  } catch (error) {
    console.error("위시리스트 삭제 오류:", error);
    res.status(500).json({ message: "위시리스트 제거 실패" });
  }
};
