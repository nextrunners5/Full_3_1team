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
                  ORDER BY ua.is_default DESC, ua.created_at DESC`;
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

interface ShippingFee{
  shipping_fee:string;
}

//배송비 get
export const getShippingFee = async (userId: string): Promise<ShippingFee[]> => {
  const query = `SELECT shipping_fee FROM Orders WHERE user_id = ?`;
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

//주문하는 제품 정보 가져오기
export const getOrderSingleProducts = async(userId: string) => {
  const singleProductQuery = `SELECT oi.product_count, p.product_id, p.product_name, o.final_amount, o.order_id, oi.option_color, oi.option_size
                              FROM Orders o
                              JOIN OrderItems  oi ON o.order_id = oi.order_id
                              JOIN Products p ON oi.product_id = p.product_id
                              WHERE o.user_id = ? AND o.order_type = 'OT002' AND oi.product_id = p.product_id 
                              ORDER BY o.order_date DESC LIMIT 1`;
  try{
    const [res] = await pool.promise().query(singleProductQuery,[userId]);
    const rows = res as any[]; 
    if(rows.length > 0){
      for(let i = 0; i < rows.length; i++){
        const finalPrice = rows[i].final_amount;
        const price = parseFloat(finalPrice).toFixed(0);
        rows[i].final_price = Number(price);
        console.log('orderProducts price: ', price);
      }
      return rows;
    }
  }catch(err){
    console.error('주문하려는 제품의 정보를 가져오지 못했습니다.', err);
  }
}

export const getOrderProductItems = async (userId: string) => {
  const cartProductQuery = `SELECT oi.product_count, p.product_id, p.product_name, o.final_amount, o.order_id, oi.option_color, oi.option_size
                            FROM Orders o
                            JOIN OrderItems  oi ON o.order_id = oi.order_id
                            JOIN Products p ON oi.product_id = p.product_id
                            WHERE o.user_id = ? AND o.order_type = 'OT001'`;
  try{
    const [res] = await pool.promise().query(cartProductQuery,[userId]);
    const rows = res as any[]; 
    if(rows.length > 0){
      for(let i = 0; i < rows.length; i++){
        const finalPrice = rows[i].final_amount;
        const price = parseFloat(finalPrice).toFixed(0);
        rows[i].final_price = Number(price);
        console.log('orderProducts: ', price);
      }
      return rows;
    }

  }catch(err){
    console.error('주문하려는 제품의 정보를 가져오지 못했습니다.', err);
  }
}


export const insertOrderItems = async(userid: string, totalAmount:number, discountAmount:number, finalAmount:number, shippingFee:number, orderType:string, productId:number, statusid:string,quantity:number,selectedSize:any,selectedColor:any) => {
  const connection = await pool.promise().getConnection();
  try{
    await connection.beginTransaction();

    const createOrderId = () => {
      const timestamp = Date.now().toString().slice(-6);
      return `ODR${timestamp}`;
    };
    const orderId = createOrderId();
    console.log('generated orderId', orderId);
    
    const orderQuery = `INSERT INTO Orders(order_id, user_id, status_id, total_amount, discount_amount, final_amount, shipping_fee, order_type) 
                        VALUES(?,?,?,?,?,?,?,?)`;

    console.log('Executing orderQuery:', orderQuery);
    console.log('Query parameters:', [orderId, userid, statusid, totalAmount, discountAmount, finalAmount, shippingFee, orderType]);

    const [orderInsertResult] = await connection.query(orderQuery, [
      orderId, 
      userid, 
      statusid, 
      totalAmount, 
      discountAmount,
      finalAmount,
      shippingFee,
      orderType
    ]);

    console.log('order insert result', orderInsertResult);
    console.log('생성된 orderid', orderId);

    await connection.commit();

    const orderIdCheckQuery = `SELECT order_id FROM Orders WHERE order_id = ?`;
    const [orderIdCheckResult] = await connection.query(orderIdCheckQuery, [orderId]);

    if ((orderIdCheckResult as any[]).length === 0) {
      throw new Error('order_id를 Orders 테이블에서 찾지 못했습니다.');
    }
    console.log("orderidcheck",orderIdCheckResult);

    const createOrderItemId = () => {
      const timestamp = Date.now().toString().slice(-6);
      return `ODRI${timestamp}`;
    };
    const orderItemId = createOrderItemId();
    console.log('generated orderItemId', orderItemId);
    const orderItemsQuery = `INSERT INTO OrderItems(orderItems_id, order_id, product_id, order_status, product_count, option_size, option_color) 
                              VALUES(?,?,?,?,?,?,?)`;
    await connection.query(orderItemsQuery,[
      orderItemId, 
      orderId, 
      productId, 
      statusid, 
      quantity, 
      selectedSize,
      selectedColor 
    ]);
    await connection.commit();
    return orderId;
  } catch(err){
    await connection.rollback();
    console.error('주문 상세 정보를 주문 테이블에 추가하지 못했습니다.', err);
    throw err;
  } finally{
    connection.release();
  }
}

export const insertOrderDelivery = async(orderId: string, selectedAddress: any, selectedMessage: string) => {
  console.log('[insertOrderDelivery]', orderId, selectedAddress, selectedMessage);
  try{
    const deliveryStatus = 'DS001'
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2);
    const formattedDeliveryDate = deliveryDate.toISOString().slice(0, 19).replace("T", " ");

    const deliveryQuery = 
    `INSERT INTO Delivery(order_id, delivery_status, delivery_message, delivery_address, delivery_date)
    VALUES(?,?,?,?,?);`
    const [res] = await pool.promise().query(deliveryQuery,[orderId,deliveryStatus,selectedMessage,selectedAddress,formattedDeliveryDate]);

    console.log('주문 배송지 정보가 추가되었습니다.');
  }catch(err){
    console.error('주문 배송지를 추가하지 못했습니다.', err);
  }
}

export const updateOrderStatus = async(orderId: string) => {
  console.log('[updateOrderStatus]', orderId);
  try{
    const deliveryStatus = 'DS001'
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2);
    const formattedDeliveryDate = deliveryDate.toISOString().slice(0, 19).replace("T", " ");

    const deliveryQuery = 
    `INSERT INTO Delivery(order_id, delivery_status, delivery_message, delivery_address, delivery_date)
    VALUES(?,?,?,?,?);`
    const [res] = await pool.promise().query(deliveryQuery,[orderId]);

    console.log('주문 배송지 정보가 추가되었습니다.');
  }catch(err){
    console.error('주문 배송지를 추가하지 못했습니다.', err);
  }
}