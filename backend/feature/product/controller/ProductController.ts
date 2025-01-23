import { Request, Response } from 'express';

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: 상품 관련 API
 */

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: 모든 상품 조회
 *     description: 등록된 모든 상품 목록을 가져옵니다.
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: 상품 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "64f9a4b8f9d3"
 *                   name:
 *                     type: string
 *                     example: "무선 키보드"
 *                   price:
 *                     type: number
 *                     example: 45000
 *                   image:
 *                     type: string
 *                     example: "https://example.com/product-image.jpg"
 */
export const getProducts = (req: Request, res: Response): void => {
  const products = [
    { id: "64f9a4b8f9d3", name: "무선 키보드", price: 45000, image: "https://example.com/product-image.jpg" },
    { id: "64f9a4b8f9d4", name: "게이밍 마우스", price: 30000, image: "https://example.com/product-image.jpg" }
  ];

  res.status(200).json(products); // ✅ `return` 없이 사용
};

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: 특정 상품 조회
 *     description: 상품 ID를 이용하여 특정 상품을 조회합니다.
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "64f9a4b8f9d3"
 *     responses:
 *       200:
 *         description: 상품 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "64f9a4b8f9d3"
 *                 name:
 *                   type: string
 *                   example: "무선 키보드"
 *                 price:
 *                   type: number
 *                   example: 45000
 *                 image:
 *                   type: string
 *                   example: "https://example.com/product-image.jpg"
 *       400:
 *         description: 잘못된 요청 (ID 누락)
 *       404:
 *         description: 상품을 찾을 수 없음
 */
export const getProductById = (req: Request, res: Response): void => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: "ID가 필요합니다." }); // ✅ `return` 없이 사용
    return;
  }

  console.log("Received ID:", id);

  const products = [
    { id: "64f9a4b8f9d3", name: "무선 키보드", price: 45000, image: "https://example.com/product-image.jpg" },
    { id: "64f9a4b8f9d4", name: "게이밍 마우스", price: 30000, image: "https://example.com/product-image.jpg" }
  ];

  const product = products.find(p => p.id === id.trim());

  if (!product) {
    console.log("상품을 찾을 수 없음:", id);
    res.status(404).json({ message: "상품을 찾을 수 없습니다." }); // ✅ `return` 없이 사용
    return;
  }

  res.status(200).json(product);
};
