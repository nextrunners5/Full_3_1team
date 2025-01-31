import { Request, Response } from "express";
import db from "../../../config/dbConfig";

// 장바구니 타입 정의
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

/**
 * 📌 1. 장바구니 목록 조회 (GET /api/cart)
 */
export const getCart = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<CartItem[]>("SELECT * FROM cart");
    res.json(rows);
  } catch (error) {
    console.error("❌ 장바구니 조회 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

/**
 * 📌 2. 상품 추가 (POST /api/cart)
 */
export const addToCart = async (req: Request, res: Response) => {
  const { id, name, price, quantity, image } = req.body;
  try {
    const [existing] = await db.query<CartItem[]>("SELECT * FROM cart WHERE id = ?", [id]);

    if (existing.length > 0) {
      await db.query("UPDATE cart SET quantity = quantity + ? WHERE id = ?", [quantity, id]);
    } else {
      await db.query(
        "INSERT INTO cart (id, name, price, quantity, image) VALUES (?, ?, ?, ?, ?)",
        [id, name, price, quantity, image]
      );
    }

    const [updatedCart] = await db.query<CartItem[]>("SELECT * FROM cart");
    res.json(updatedCart);
  } catch (error) {
    console.error("❌ 상품 추가 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

/**
 * 📌 3. 상품 수량 증가 (PUT /api/cart/:id/increase)
 */
export const increaseQuantity = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.query("UPDATE cart SET quantity = quantity + 1 WHERE id = ?", [id]);
    const [updatedCart] = await db.query<CartItem[]>("SELECT * FROM cart");
    res.json(updatedCart);
  } catch (error) {
    console.error("❌ 수량 증가 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

/**
 * 📌 4. 상품 수량 감소 (PUT /api/cart/:id/decrease)
 */
export const decreaseQuantity = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.query("UPDATE cart SET quantity = quantity - 1 WHERE id = ? AND quantity > 1", [id]);
    const [updatedCart] = await db.query<CartItem[]>("SELECT * FROM cart");
    res.json(updatedCart);
  } catch (error) {
    console.error("❌ 수량 감소 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

/**
 * 📌 5. 상품 삭제 (DELETE /api/cart/:id)
 */
export const removeItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM cart WHERE id = ?", [id]);
    const [updatedCart] = await db.query<CartItem[]>("SELECT * FROM cart");
    res.json(updatedCart);
  } catch (error) {
    console.error("❌ 상품 삭제 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

/**
 * 📌 6. 선택한 상품 삭제 (POST /api/cart/remove-selected)
 */
export const removeSelectedItems = async (req: Request, res: Response) => {
  const { selectedIds } = req.body;
  try {
    if (selectedIds.length > 0) {
      await db.query("DELETE FROM cart WHERE id IN (?)", [selectedIds]);
    }
    const [updatedCart] = await db.query<CartItem[]>("SELECT * FROM cart");
    res.json(updatedCart);
  } catch (error) {
    console.error("❌ 선택 삭제 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};
