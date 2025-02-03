import express from "express";
import { addToWishlist, removeFromWishlist, getWishlist } from "../feature/product/controller/WishlistController";

const router = express.Router();

router.post("/", addToWishlist);
router.delete("/:productId", removeFromWishlist);
router.get("/", getWishlist);

export default router;
