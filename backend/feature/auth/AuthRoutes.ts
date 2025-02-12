import express from 'express';
import { Auth } from './domains/Auth';
import passport from 'passport';
import { RowDataPacket } from 'mysql2';
import pool from '../../config/dbConfig';

const router = express.Router();

// 회원가입 라우트
router.post('/signup', async (req, res) => {
  try {
    const { userId, password, name, email, phone } = req.body;
    
    // 필수 필드 검증
    if (!userId || !password || !name || !email) {
      return res.status(400).json({
        success: false,
        message: '모든 필수 항목을 입력해주세요.'
      });
    }

    // 회원가입 처리
    const result = await Auth.signup({
      userId,
      password,
      name,
      email,
      phone
    });

    res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      user: {
        userId: result.userId,
        name: result.name,
        email: result.email
      }
    });
  } catch (error) {
    console.error('회원가입 실패:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : '회원가입 처리 중 오류가 발생했습니다.'
    });
  }
});

// 아이디 찾기 라우트
router.post('/recoverId', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: '이름과 이메일을 모두 입력해주세요.'
      });
    }

    // 데이터베이스에서 사용자 찾기
    const [rows] = await pool.promise().query<RowDataPacket[]>(
      'SELECT user_id FROM Users WHERE name = ? AND email = ?',
      [name, email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '일치하는 사용자 정보를 찾을 수 없습니다.'
      });
    }

    const user = rows[0];
    res.json({
      success: true,
      message: `회원님의 아이디는 ${user.user_id} 입니다.`
    });

  } catch (error) {
    console.error('아이디 찾기 실패:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});

// 비밀번호 재설정 라우트
router.post('/resetPassword', async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: '모든 필수 정보를 입력해주세요.'
      });
    }

    // 데이터베이스에서 사용자 찾기
    const [rows] = await pool.promise().query<RowDataPacket[]>(
      'SELECT user_id FROM Users WHERE name = ? AND email = ? AND phone = ?',
      [name, email, phone]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '일치하는 사용자 정보를 찾을 수 없습니다.'
      });
    }

    // 임시 비밀번호 생성 (8자리)
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // 비밀번호 해시화 및 업데이트
    const hashedPassword = await Auth.hashPassword(tempPassword);
    await pool.promise().query(
      'UPDATE Users SET password = ? WHERE user_id = ?',
      [hashedPassword, rows[0].user_id]
    );

    res.json({
      success: true,
      message: `임시 비밀번호가 발급되었습니다: ${tempPassword}\n로그인 후 비밀번호를 변경해주세요.`
    });

  } catch (error) {
    console.error('비밀번호 재설정 실패:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});

// 로그인 라우트
router.post('/login', async (req, res) => {
  // ... existing code ...
});

// 카카오 로그인 콜백 라우트
router.get('/kakao/callback', async (req, res) => {
  // ... existing code ...
});

export default router;