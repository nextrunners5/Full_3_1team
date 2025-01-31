import express from "express";
import { getCart, addToCart, increaseQuantity, decreaseQuantity, removeItem, removeSelectedItems } from "../feature/cart/controller/CartController";

const router = express.Router();

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:id/increase", increaseQuantity);
router.put("/:id/decrease", decreaseQuantity);
router.delete("/:id", removeItem);
router.post("/remove-selected", removeSelectedItems);

export default router;
