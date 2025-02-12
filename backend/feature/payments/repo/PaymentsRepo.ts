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

export class PaymentsRepo {
  static async savePayment(payment: Payment): Promise<void> {
    const connection = await pool.promise().getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        `INSERT INTO Payments 
        (payment_key, order_id, amount, status, payment_data) 
        VALUES (?, ?, ?, ?, ?)`,
        [
          payment.paymentKey,
          payment.orderId,
          payment.amount,
          payment.status,
          JSON.stringify(payment.paymentData)
        ]
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}