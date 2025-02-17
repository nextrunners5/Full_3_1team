// RecommendedProductsRoutes.ts
import express from "express";
import { getRecommendedProducts } from "../feature/product/controllers/RecommendedProductsController";

const router = express.Router();

// GET /api/recommended-products
router.get("/", getRecommendedProducts);

export default router;
