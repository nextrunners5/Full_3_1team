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


export const getUserAddress = async(userId: string) => {
  const query = "select recipient_name, recipient_phone, address from Users u join UserAddresses ua on u.user_id = ua.user_id where u.user_id = ? order by ua.created_at asc limit 1";
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

export const getOrderProducts = async() => {
  const query = "select "
}
