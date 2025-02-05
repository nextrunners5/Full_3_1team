import { Request, Response } from "express";
import * as cartService from "../services/CartService";

// 장바구니 조회 API
export const getCart = async (req: Request, res: Response) => {
    try {
      const items = await cartService.getCart();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "장바구니 불러오기 실패", error });
    }
  };
  
  // 장바구니 상품 추가 API
  export const addToCart = async (req: Request, res: Response) => {
    try {
      const { userId, productId, quantity } = req.body;
      await cartService.addToCart(userId, productId, quantity);
      res.status(201).json({ message: "장바구니에 추가되었습니다." });
    } catch (error) {
      res.status(500).json({ message: "상품 추가 실패", error });
    }
  };
  
  // 상품 수량 증가 API
  export const increaseQuantity = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await cartService.increaseQuantity(Number(id));
      res.json({ message: "수량이 증가되었습니다." });
    } catch (error) {
      res.status(500).json({ message: "수량 증가 실패", error });
    }
  };
  
  // 상품 수량 감소 API
  export const decreaseQuantity = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await cartService.decreaseQuantity(Number(id));
      res.json({ message: "수량이 감소되었습니다." });
    } catch (error) {
      res.status(500).json({ message: "수량 감소 실패", error });
    }
  };
  
  // 개별 상품 삭제 API
  export const removeItem = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await cartService.removeItem(Number(id));
      res.json({ message: "상품이 삭제되었습니다." });
    } catch (error) {
      res.status(500).json({ message: "상품 삭제 실패", error });
    }
  };
  
  // 선택된 상품 삭제 API
  export const removeSelectedItems = async (req: Request, res: Response) => {
    try {
      const { ids } = req.body;
      await cartService.removeSelectedItems(ids);
      res.json({ message: "선택한 상품들이 삭제되었습니다." });
    } catch (error) {
      res.status(500).json({ message: "선택 상품 삭제 실패", error });
    }
  };
  