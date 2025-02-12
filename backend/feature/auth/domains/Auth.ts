//엔티티 
//Table 객체로 변환 
//보통 클래스로 관리

// class Orders{
//   id: number;
// }

import passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { Profile } from 'passport-kakao';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import axios from 'axios';
import pool from '../../../config/dbConfig';
import { RowDataPacket } from 'mysql2';

export interface User {
  id?: number;
  socialId: string;
  email?: string;
  nickname: string;
  provider: string;
}

export interface TokenUser {
  id: number | string;
  email: string;
  nickname: string;
  signup_type: 'local' | 'kakao' | 'naver' | 'google';
}

export interface KakaoUser {
  id: string;
  email: string;
  nickname: string;
}

export interface SignupData {
  userId: string;
  password: string;
  name: string;
  email: string;
  phone: string;
}

export interface LoginData {
  userId: string;
  password: string;
}

export class Auth {
  static async saveOrGetUser(kakaoId: number, email: string, nickname: string): Promise<KakaoUser & { signup_type: 'kakao' }> {
    try {
      // 기존 사용자 조회
      const [rows] = await pool.promise().query<RowDataPacket[]>(
        'SELECT user_id, email, name FROM Users WHERE kakao_id = ?',
        [kakaoId]
      );

      if (rows.length > 0) {
        const user = rows[0];
        return {
          id: user.user_id,
          email: user.email,
          nickname: user.name,
          signup_type: 'kakao'
        };
      }

      // 새 사용자 생성
      const userId = `kakao_${kakaoId}`;
      await pool.promise().query(
        'INSERT INTO Users (user_id, email, name, kakao_id, signup_type) VALUES (?, ?, ?, ?, ?)',
        [userId, email, nickname, kakaoId, 'kakao']
      );

      return {
        id: userId,
        email,
        nickname,
        signup_type: 'kakao'
      };
    } catch (error) {
      console.error('사용자 저장/조회 실패:', error);
      throw new Error('사용자 처리 중 오류가 발생했습니다.');
    }
  }

  static initializePassport() {
    passport.use(
      new KakaoStrategy(
        {
          clientID: process.env.KAKAO_CLIENT_ID || '',
          clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
          callbackURL: process.env.KAKAO_REDIRECT_URI || 'http://localhost:5173/oauth/callback/kakao'
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile._json?.kakao_account?.email;
            const nickname = profile.displayName;
            const user = await Auth.saveOrGetUser(Number(profile.id), email || '', nickname);
            done(null, user);
          } catch (error) {
            done(error as Error);
          }
        }
      )
    );
  }

  static generateTokens(user: TokenUser) {
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        signup_type: user.signup_type
      },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key',
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  static async handleKakaoCallback(code: string): Promise<{ tokens: any; user: any }> {
    try {
      // 카카오 토큰 받기
      const tokenResponse = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        null,
        {
          params: {
            grant_type: 'authorization_code',
            client_id: process.env.KAKAO_CLIENT_ID,
            client_secret: process.env.KAKAO_CLIENT_SECRET,
            redirect_uri: process.env.KAKAO_REDIRECT_URI,
            code
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      // 카카오 사용자 정보 받기
      const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`
        }
      });

      const kakaoId = userResponse.data.id;
      const email = userResponse.data.kakao_account?.email;
      const nickname = userResponse.data.properties?.nickname;

      // 사용자 저장 또는 조회
      const user = await Auth.saveOrGetUser(kakaoId, email, nickname);

      // JWT 토큰 생성
      const tokens = Auth.generateTokens({
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        signup_type: 'kakao'
      });

      return { tokens, user };
    } catch (error) {
      console.error('카카오 로그인 처리 실패:', error);
      throw new Error('카카오 로그인 처리 중 오류가 발생했습니다.');
    }
  }

  static async signup(data: SignupData): Promise<any> {
    try {
      const { userId, password, name, email, phone } = data;
      const hashedPassword = await bcrypt.hash(password, 10);
      const connection = await pool.promise().getConnection();
      
      await connection.beginTransaction();

      try {
        await connection.query(
          'INSERT INTO Users (user_id, name, email, phone, signup_type) VALUES (?, ?, ?, ?, ?)',
          [userId, name, email, phone, 'local']
        );

        await connection.query(
          'INSERT INTO UserAuth (user_id, auth_type, password) VALUES (?, ?, ?)',
          [userId, 'local', hashedPassword]
        );

        await connection.commit();
        connection.release();

        return {
          success: true,
          message: '회원가입이 완료되었습니다.',
          user: { userId, email, name }
        };
      } catch (error: any) {
        await connection.rollback();
        connection.release();

        // MySQL 에러 코드에 따른 구체적인 에러 메시지
        if (error.code === 'ER_DUP_ENTRY') {
          if (error.sqlMessage.includes('Users.email')) {
            throw new Error('이미 사용중인 이메일입니다.');
          }
          if (error.sqlMessage.includes('Users.user_id')) {
            throw new Error('이미 사용중인 아이디입니다.');
          }
          if (error.sqlMessage.includes('Users.phone')) {
            throw new Error('이미 등록된 전화번호입니다.');
          }
        }
        throw error;
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    }
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static async checkUserId(userId: string): Promise<boolean> {
    try {
      const [rows] = await pool.promise().query(
        'SELECT COUNT(*) as count FROM Users WHERE user_id = ?',
        [userId]
      );
      
      const result = (rows as any[])[0];
      return result.count === 0; // 사용 가능하면 true, 이미 존재하면 false 반환
    } catch (error) {
      console.error('아이디 중복 확인 실패:', error);
      throw new Error('아이디 중복 확인 중 오류가 발생했습니다.');
    }
  }

  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  static async login(data: LoginData) {
    try {
      // 사용자 정보 조회
      const [users] = await pool.promise().query<RowDataPacket[]>(
        'SELECT u.*, ua.password FROM Users u JOIN UserAuth ua ON u.user_id = ua.user_id WHERE u.user_id = ? AND ua.auth_type = ?',
        [data.userId, 'local']
      );

      const user = users[0];
      if (!user) {
        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
      }

      // 비밀번호 검증
      const isValidPassword = await bcrypt.compare(data.password, user.password);
      if (!isValidPassword) {
        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
      }

      // 마지막 로그인 시간 업데이트
      await pool.promise().query(
        'UPDATE Users SET recent_at = NOW() WHERE user_id = ?',
        [user.user_id]
      );

      // 토큰 생성
      const tokens = Auth.generateTokens({
        id: user.user_id,
        email: user.email,
        nickname: user.name,
        signup_type: user.signup_type
      });

      return {
        success: true,
        message: '로그인에 성공했습니다.',
        user: {
          userId: user.user_id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        },
        tokens
      };
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  }

  static async findUserByEmailAndPhone(email: string, phone: string) {
    try {
      const [rows] = await pool.promise().query<RowDataPacket[]>(
        'SELECT user_id FROM Users WHERE email = ? AND phone = ?',
        [email, phone]
      );
      
      if (!rows[0]) {
        throw new Error('일치하는 사용자를 찾을 수 없습니다.');
      }
      
      return {
        userId: rows[0].user_id
      };
    } catch (error) {
      console.error('사용자 조회 실패:', error);
      throw error;
    }
  }

  static async findUserForReset(userId: string, email: string, phone: string) {
    try {
      const [rows] = await pool.promise().query<RowDataPacket[]>(
        'SELECT * FROM Users WHERE user_id = ? AND email = ? AND phone = ?',
        [userId, email, phone]
      );
      
      if (!rows[0]) {
        throw new Error('일치하는 사용자를 찾을 수 없습니다.');
      }
      
      return rows[0];
    } catch (error) {
      console.error('사용자 조회 실패:', error);
      throw error;
    }
  }

  static async updatePassword(userId: string, newPassword: string) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await pool.promise().query(
        'UPDATE UserAuth SET password = ? WHERE user_id = ?',
        [hashedPassword, userId]
      );
    } catch (error) {
      console.error('비밀번호 업데이트 실패:', error);
      throw error;
    }
  }
}

export default Auth;
