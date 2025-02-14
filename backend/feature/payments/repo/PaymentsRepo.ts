//db 연산 

//crud
// import { getRepository } from 'typeorm';
// import { Product } from './entities/Product';

// async function main() {
//   const productRepository = getRepository(Product);

//   // Create a new product
//   const newProduct = productRepository.create({
//     name: 'Product 1',
//     price: 19.99,
//     quantity: 10,
//   });

//   // Save the product
//   await productRepository.save(newProduct);

//   // Update the product
//   newProduct.price = 29.99;
//   await productRepository.save(newProduct);

//   // Find all products
//   const products = await productRepository.find();
//   console.log('All products:', products);

//   // Delete the product
//   await productRepository.delete(newProduct.id);
// }

import pool from '../../../config/dbConfig';
import { Payment } from '../domains/Payments';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class PaymentsRepo {
  static async savePayment(payment: Payment): Promise<number> {
    const connection = await pool.promise().getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO Payment 
        (order_id, payment_key, payment_type, order_name, payment_method, 
         final_price, balance_amount, discount_price, currency, payment_status, 
         requested_at, approved_at, mid) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          payment.order_id,
          payment.payment_key,
          payment.payment_type,
          payment.order_name,
          payment.payment_method,
          payment.final_price,
          payment.balance_amount,
          payment.discount_price,
          payment.currency,
          payment.payment_status,
          payment.requested_at,
          payment.approved_at,
          payment.mid
        ]
      );

      await connection.commit();
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getPaymentByKey(paymentKey: string): Promise<Payment | null> {
    const [rows] = await pool.promise().query<RowDataPacket[]>(
      'SELECT * FROM Payment WHERE payment_key = ?',
      [paymentKey]
    );
    return rows[0] as Payment || null;
  }

  static async updatePaymentStatus(paymentKey: string, status: string): Promise<void> {
    await pool.promise().query(
      'UPDATE Payment SET payment_status = ? WHERE payment_key = ?',
      [status, paymentKey]
    );
  }
}