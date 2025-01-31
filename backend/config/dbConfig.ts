import mysql, { createPool } from "mysql2/promise";
import {config} from 'dotenv';
config();

// MySQL 연결 설정
const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "ecommerce",
  port: Number(process.env.DB_PORT) || 3306,
  };

const pool = createPool(dbConfig);

// MySQL 연결 테스트 (비동기 방식으로 수정)
const testConnection = async () => {
  try {
    const connection = await pool.getConnection(); // 여기서 오류 발생 가능
    console.log("✅ MySQL DB 연결 성공");
    connection.release();
  } catch (err) {
    console.error("❌ MySQL DB 연결 실패:", err);
  }
};

// 실행 시 MySQL 연결 확인
testConnection();

export default pool;