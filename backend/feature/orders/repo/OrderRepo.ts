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
import pool from "../../../config/dbConfig"

//포인트 가져오기
export const getUserPoints = async(userId: string) => {
  // const query = 'select point from User where user_id = ?';
  const query = `select point from Users where user_id = ?`;
  try{
    const res = await pool.promise().query(query,[userId]);
    if(res){
      console.log('res: ', res[0]);
      return res[0];
    }
  } catch(err){
    console.error('포인트를 가져오지 못했습니다.',err);
  }
};

//배송 메시지 가져오기
export const getDeliveryMessage = async() => {
  const query = `select description from Common where status_code like 'DM%'`;
  try{
    const res = await pool.promise().query(query);
    if(res){
      console.log('res: ', res[0]);
      return res[0];
    }
  } catch(err){
    console.error('배송 메시지를 가져오지 못했습니다',err);
  }
};

//사용자 배송지 가져오기
export const getUserAddress = async(userId: string) => {
  const query = ` SELECT recipient_name, recipient_phone, address 
                  FROM Users u 
                  JOIN UserAddresses ua ON u.user_id = ua.user_id 
                  WHERE u.user_id = ? 
                  ORDER BY ua.created_at ASC LIMIT 1`;
  try{
    const res = await pool.promise().query(query,[userId]);
    if(res){
      console.log('res: ', res[0]);
      return res[0];
    }
  } catch(err){
    console.error('배송지를 가져오지 못했습니다.',err);
  }
}

//사용자 배송지 상세 가져오기
export const getUserDetailsAddress = async(userId: string) => {
  const query = ` SELECT address_id, address_name, recipient_name, recipient_phone, address, detailed_address, is_default
                  FROM Users u 
                  JOIN UserAddresses ua ON u.user_id = ua.user_id 
                  WHERE u.user_id = ? 
                  ORDER BY ua.created_at ASC`;
  try{
    const [res] = await pool.promise().query(query,[userId]);
    const rows = res as any[];
    if(rows.length > 0){
      console.log('rows: ', rows);
      return rows;
    }
  } catch(err){
    console.error('배송지 상세 리스트를 가져오지 못했습니다.',err);
  }
}


//주문하는 제품 정보 가져오기
export const getOrderProducts = async(userId: string) => {
  const query = ` SELECT cd.quantity, p.product_name, p.final_price 
                  FROM CartDetail cd 
                  JOIN Products p ON cd.product_id = p.product_id 
                  JOIN Cart c ON cd.cart_id = c.cart_id 
                  WHERE c.user_id = ?`;
  try{
    const [res] = await pool.promise().query(query,[userId]);
    const rows = res as any[]; 
    if(rows.length > 0){
      for(let i = 0; i < rows.length; i++){
        const finalPrice = rows[i].final_price;
        const price = parseFloat(finalPrice).toFixed(0);
        rows[i].final_price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        console.log('orderProducts: ', price);
      }
      return rows;
    }
  }catch(err){
    console.error('주문하려는 제품의 정보를 가져오지 못했습니다.', err);
  }
}
interface ShippingFee{
  shipping_fee:string;
}

//배송비 get
export const getShippingFee = async (userId: string): Promise<ShippingFee[]> => {
  const query = `SELECT shipping_fee FROM Cart WHERE user_id = ?`;
  return new Promise((resolve, reject) => {
    pool.query(query, [userId], (err, results) => {
      if (err) {
        console.error('배송비 금액을 가져오지 못했습니다.', err);
        return reject(err);
      }
      const rows = results as any[]; 
      if (rows.length > 0) {
        const shippingFee = rows[0].shipping_fee;
        const fee = parseFloat(shippingFee).toFixed(0); 
        rows[0].final_price = fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); // '3000.00'을 '3000'으로 변환
        console.log('ResponseShippingFee: ', [{ shipping_fee: rows[0].final_price }]);
        return resolve([{ shipping_fee: rows[0].final_price }]);
      } else {
        console.log('배송비 금액을 찾지 못했습니다.');
        return resolve([]);
      }
    });
  });
};