import { Request, Response } from 'express';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 사용자 인증 관련 API
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 회원가입
 *     description: 새 사용자를 등록합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *               name:
 *                 type: string
 *                 example: "홍길동"
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "64f9a4b8f9d3"
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 name:
 *                   type: string
 *                   example: "홍길동"
 */
export function register(req: Request, res: Response) {
  res.status(201).json({
    id: "64f9a4b8f9d3",
    email: req.body.email,
    name: req.body.name
  });
}

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     description: 이메일과 비밀번호를 이용해 로그인합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "jwt_token_here"
 */
export function login(req: Request, res: Response) {
  res.status(200).json({ token: 'jwt_token_here' });
}
