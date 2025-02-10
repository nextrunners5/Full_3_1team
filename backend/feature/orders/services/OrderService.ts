//비즈니스 수

//리포저티토리랑 연계를해서 DB에 데이터를 적재하는 기능을 수행

//controller -> service -> repository -> db

import {
  getDeliveryMessage, 
  getOrderProductItems, 
  getOrderSingleProducts, 
  // getOrderProducts, 
  getShippingFee, 
  getUserAddress, 
  getUserDetailsAddress, 
  getUserPoints, 
  // insertOrder,
  insertOrderItems, 
} from "../repo/OrderRepo";

export const fetchUserPoints = async(userId: string) => {
  try {
    // const userPoints = await getUserPoints(userId);
    const userPoints = await getUserPoints('user123');
    return userPoints;
  } catch(err){
    console.error('사용자 포인트를 가져오지 못했습니다.', err);
    throw err;
  }
};

export const fetchDeliveryMessage = async() => {
  try{
    const message = await getDeliveryMessage();
    return message;
  } catch(err){
    console.error('배송 메시지를 불러오지 못했습니다.',err);
    throw err;
  }
}

export const fetchUserAddress = async(userId: string) => {
  try{
    const userAddress = await getUserAddress('user123');
    // const userAddress = await getUserAddress(userId);
    return userAddress;
  } catch(err){
    console.error('배송지 정보를 가져오지 못했습니다.', err);
    throw err;
  } 
};

export const fetchUserDetailsAddress = async(userId: string) => {
  try{
    const userAddress = await getUserDetailsAddress('user123');
    return userAddress;
  } catch(err){
    console.error('배송지 상세 리스트 정보를 가져오지 못했습니다.', err);
    throw err;
  } 
};

export const fetchOrderProducts = async() => {
  try{
    const orderProductsInfo = await getOrderSingleProducts('user123');
    return orderProductsInfo;
  } catch(err){
    console.error('제품 정보를 가져오지 못했습니다.', err);
    throw err;
  }
};

export const fetchShippingFee = async(userId: string) => {
  try{
    const shippingFee = await getShippingFee('user123');
    console.log('shipping fee: ', shippingFee);
    return shippingFee;
  } catch(err){
    console.error('배송비 정보를 가져오지 못했습니다.', err);
    throw err;
  }
};

export const fetchOrderSingleProduct = async(orderData:any) => {
  try{
    const userid = 'user123';
    const statusid = 'OS001';
    const orderType = 'OT002';
    const {userId, productId, quantity, totalAmount, discountAmount, finalAmount, shippingFee, selectedSize, selectedColor, statusId} = orderData;
    // const orderId = await insertOrder(userid, totalAmount, discountAmount, finalAmount, shippingFee, statusid, orderType);
    const orderId = await insertOrderItems(userid, totalAmount, discountAmount, finalAmount, shippingFee, orderType, productId, statusid,quantity,selectedSize,selectedColor);
    console.log('orderID', orderId,typeof(orderId));
    if(!orderId){
      throw new Error('order_id가 존재하지 않습니다.');
    }
    return orderId;
    // await insertOrderItems(orderId, productId, statusid,quantity,selectedSize,selectedColor);
  } catch(err){
    console.error('단일 상품 저장 실패', err);
    throw err;
  }
}