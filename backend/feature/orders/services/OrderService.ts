//비즈니스 수

//리포저티토리랑 연계를해서 DB에 데이터를 적재하는 기능을 수행

//controller -> service -> repository -> db

import {getDeliveryMessage, getOrderProducts, getUserAddress, getUserPoints} from "../repo/OrderRepo";

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

export const fetchOrderProducts = async() => {
  try{
    const orderProductsInfo = await getOrderProducts('user123');
    return orderProductsInfo;
  } catch(err){
    console.error('제품 정보를 가져오지 못했습니다.', err);
    throw err;
  }
};