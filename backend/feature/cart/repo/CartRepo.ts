import { RowDataPacket } from "mysql2";
import pool from "../../../config/dbConfig";

// 장바구니 조회
export const getCart = async () => {
  const [rows] = await pool
    .promise()
    .query<RowDataPacket[]>("SELECT * FROM Cart");
  return rows;
};

// 장바구니에 상품 추가
export const addToCart = async (
  userId: number,
  productId: number,
  quantity: number
) => {
  await pool.query(
    "INSERT INTO Cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?",
    [userId, productId, quantity, quantity]
  );
};

// 상품 수량 증가
export const increaseQuantity = async (id: number) => {
  await pool.query("UPDATE Cart SET quantity = quantity + 1 WHERE id = ?", [
    id
  ]);
};

// 상품 수량 감소
export const decreaseQuantity = async (id: number) => {
  await pool.query(
    "UPDATE Cart SET quantity = quantity - 1 WHERE id = ? AND quantity > 1",
    [id]
  );
};

// 개별 상품 삭제
export const removeItem = async (id: number) => {
  await pool.query("DELETE FROM Cart WHERE id = ?", [id]);
};

// 선택된 상품 삭제
export const removeSelectedItems = async (ids: number[]) => {
  await pool.query("DELETE FROM Cart WHERE id IN (?)", [ids]);
};
