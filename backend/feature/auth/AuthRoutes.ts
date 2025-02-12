import express, { Request, Response, NextFunction } from 'express';
import { Auth } from './domains/Auth';
import passport from 'passport';
import { RowDataPacket } from 'mysql2';
import pool from '../../config/dbConfig';

const router = express.Router();

// ... 라우트 핸들러들 ...

export default router; 