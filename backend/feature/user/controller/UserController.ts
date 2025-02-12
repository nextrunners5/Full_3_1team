//컨트롤러는 사용자로부터의 요청을 받아서 처리하고, 적절한 응답을 반환하는 역할을 합니다. 
//비즈니스 로직을 서비스 계층에 위임하고, 서비스로부터 받은 결과를 클라이언트에 반환합니다.

import { RequestHandler } from 'express';
import pool from '../../../config/dbConfig';
import { RowDataPacket } from 'mysql2';
import { AuthenticatedRequest } from '../../auth/types/user';

interface Address extends RowDataPacket {
  address_id: number;
  user_id: string;
  recipient_name: string;
  address: string;
  address_detail: string;
  postal_code: string;
  phone: string;
  is_default: boolean;
}

export const getUserProfile: RequestHandler = async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.user_id;
    if (!userId) {
      res.status(401).json({ success: false, message: '인증이 필요합니다.' });
      return;
    }

    const [rows] = await pool.promise().query<RowDataPacket[]>(
      `SELECT user_id as username, name, email, phone, created_at as createdAt
       FROM Users 
       WHERE user_id = ?`,
      [userId]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    res.status(200).json({
      success: true,
      profile: rows[0]
    });
  } catch (error) {
    console.error('프로필 조회 실패:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};

export const getUserAddresses: RequestHandler = async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.user_id;
    if (!userId) {
      res.status(401).json({ success: false, message: '인증이 필요합니다.' });
      return;
    }

    const [addresses] = await pool.promise().query<Address[]>(
      'SELECT * FROM UserAddresses WHERE user_id = ? ORDER BY is_default DESC',
      [userId]
    );

    res.status(200).json({
      success: true,
      addresses: addresses
    });
  } catch (error) {
    console.error('배송지 목록 조회 실패:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};

export const addUserAddress: RequestHandler = async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.user_id;
    if (!userId) {
      res.status(401).json({ success: false, message: '인증이 필요합니다.' });
      return;
    }

    const {
      recipientName,
      address,
      addressDetail,
      postalCode,
      recipientPhone,
      isDefault
    } = req.body;

    if (isDefault) {
      await pool.promise().query(
        'UPDATE UserAddresses SET is_default = false WHERE user_id = ?',
        [userId]
      );
    }

    const query = `
      INSERT INTO UserAddresses 
      (user_id, recipient_name, address, detailed_address, postal_code, phone, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userId,
      recipientName,
      address,
      addressDetail,
      postalCode,
      recipientPhone,
      isDefault
    ];

    const [result] = await pool.promise().query(query, values);

    res.status(201).json({
      success: true,
      message: '배송지가 추가되었습니다.'
    });
  } catch (error) {
    console.error('배송지 추가 실패:', error);
    res.status(500).json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
};

export const updateUserAddress: RequestHandler = async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.user_id;
    const addressId = req.params.addressId;
    if (!userId) {
      res.status(401).json({ success: false, message: '인증이 필요합니다.' });
      return;
    }

    const { recipient_name, address, address_detail, postal_code, phone, is_default } = req.body;

    if (is_default) {
      await pool.promise().query(
        'UPDATE UserAddresses SET is_default = false WHERE user_id = ?',
        [userId]
      );
    }

    await pool.promise().query(
      `UPDATE UserAddresses 
       SET recipient_name = ?, address = ?, address_detail = ?, 
           postal_code = ?, phone = ?, is_default = ?
       WHERE address_id = ? AND user_id = ?`,
      [recipient_name, address, address_detail, postal_code, phone, is_default, addressId, userId]
    );

    res.status(200).json({
      success: true,
      message: '배송지가 수정되었습니다.'
    });
  } catch (error) {
    console.error('배송지 수정 실패:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};

export const deleteUserAddress: RequestHandler = async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.user_id;
    const addressId = req.params.addressId;
    if (!userId) {
      res.status(401).json({ success: false, message: '인증이 필요합니다.' });
      return;
    }

    await pool.promise().query(
      'DELETE FROM UserAddresses WHERE address_id = ? AND user_id = ?',
      [addressId, userId]
    );

    res.status(200).json({
      success: true,
      message: '배송지가 삭제되었습니다.'
    });
  } catch (error) {
    console.error('배송지 삭제 실패:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};