import { Request, Response } from 'express';

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: 상품 관련 API
 */

/**
 * @swagger
 * /product:
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
export function getProducts(req: Request, res: Response) {
  res.status(200).json([
    { id: "64f9a4b8f9d3", name: "무선 키보드", price: 45000, image: "https://example.com/product-image.jpg" },
    { id: "64f9a4b8f9d4", name: "게이밍 마우스", price: 30000, image: "https://example.com/product-image.jpg" }
  ]);
}

/**
 * @swagger
 * /product/{id}:
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
 *       404:
 *         description: 상품을 찾을 수 없음
 */
export function getProductById(req: Request, res: Response) {
  const { id } = req.params;
  if (id === "64f9a4b8f9d3") {
    res.status(200).json({ id, name: "무선 키보드", price: 45000, image: "https://example.com/product-image.jpg" });
  } else {
    res.status(404).json({ message: "상품을 찾을 수 없습니다." });
  }
}
