import express from 'express';
import { getProducts, getProductById } from '../feature/product/controller/ProductController';

const router = express.Router();

// ✅ 모든 상품 조회 (GET /api/product)
router.get('/product', getProducts);

// ✅ 특정 상품 조회 (GET /api/product/:id)
router.get('/product/:id', getProductById);

export default router;