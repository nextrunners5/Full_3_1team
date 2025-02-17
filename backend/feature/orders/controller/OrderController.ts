//컨트롤러는 사용자로부터의 요청을 받아서 처리하고, 적절한 응답을 반환하는 역할을 합니다. 
//비즈니스 로직을 서비스 계층에 위임하고, 서비스로부터 받은 결과를 클라이언트에 반환합니다.
import { Request, Response } from 'express';
import { fetchUserPoints, fetchDeliveryMessage, fetchUserAddress, fetchUserDetailsAddress, fetchOrderProducts, fetchShippingFee, fetchOrderSingleProduct, fetchOrderCartProduct, fetchInsertDeliveryInfo, fetchUpdateOrderStatus } from '../services/OrderService';

const getUserPoints = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  console.log('getUserPoints 백앤드 userId', userId);
  try {
    const userPoints = await fetchUserPoints(userId);
    res.json(userPoints);
    
    console.log("orderController: ",userPoints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user points' });
  }
};

const getDeliveryMessage = async (req: Request, res: Response) => {
  try{
    const deliveryMessage = await fetchDeliveryMessage();
    res.json(deliveryMessage);
    console.log("배송메시지: ", deliveryMessage);
  } catch(err){
    res.status(500).json({error: '배송메시지 출력 실패'});
  }
};

const getUserAddress = async(req: Request, res: Response) => {
  const userId = req.params.userId as string;
  // console.log('백앤드 userId', userId);
  try{
    const userAddress = await fetchUserAddress(userId);
    res.json(userAddress);

    console.log('userAddress: ', userAddress);
  } catch(err){
    res.status(500).json({error: '배송정보 불러오기 실패'});
  }
};

//사용자 주소
const getUserDetailsAddress = async(req: Request, res: Response) => {
  const userId = req.params.userId as string;
  console.log('getUserDetailsAddress 백앤드 userId', userId);
  try{
    const userAddress = await fetchUserDetailsAddress(userId);
    res.json(userAddress);

    console.log('userDetailsAddress: ', userAddress);
  } catch(err){
    res.status(500).json({error: '배송리스트 정보 불러오기 실패'});
  }
};

const getOrderProducts = async(req: Request, res: Response) => {
  const userId = req.params.userId as string;
  console.log('[getOrderProducts]유저아이디', userId);
  try{
    const orderProducts = await fetchOrderProducts(userId);
    res.json(orderProducts);
    
    console.log('orderProducts: ', orderProducts);
  } catch(err){
    res.status(500).json({error: '주문 상품 정보 불러오기 실패'});
  }
};

const getOrderShipping = async(req: Request, res: Response) => {
  const userId = req.params.userId as string;
  try{
    console.log('[백엔드] 배송비 유저아이디', userId);
    const shippingFee = await fetchShippingFee(userId);
    res.json(shippingFee);
  } catch(err){
    res.status(500).json({error: '배송비 정보 가져오기 실패'});
  }
};

const postOrderSingleProduct = async(req: Request, res: Response) => {
  const {type, userId, productId, quantity, totalAmount, discountAmount, finalAmount, shippingFee, selectedSize, selectedColor, statusId} = req.body;
  console.log('single Information', req.body);
  console.log('[백앤드] 상품데이터 유저아이디',userId);
  console.log('single Information', totalAmount, discountAmount);
  try{
    if(type === 'Single'){
      const orderId = await fetchOrderSingleProduct({
        userId, 
        productId, 
        quantity, 
        totalAmount, 
        discountAmount, 
        finalAmount, 
        shippingFee, 
        selectedSize, 
        selectedColor, 
        statusId
      });
      console.log("orderProductInfo",orderId);
      res.json(orderId);
    } else{
      const orderId = await fetchOrderCartProduct({
        userId, 
        productId, 
        quantity, 
        totalAmount, 
        discountAmount, 
        finalAmount, 
        shippingFee, 
        selectedSize, 
        selectedColor, 
        statusId
      });
      console.log("orderProductInfo",orderId);
      res.json(orderId);
    }
  }catch(err){
    res.status(500).json({error:'단일 상품 정보 저장 실패'});
  }
}

const postOrderDeliveryInfo = async(req: Request, res: Response) => {
  const {orderId, selectedAddress, selectedMessage} = req.body;
  console.log('orderInfoUpdate', req.body);
  try{
    const result = await fetchInsertDeliveryInfo(orderId, selectedAddress, selectedMessage);
    console.log('orderInfoUpdate result', result);
    res.json(result);
  } catch(err){
    res.status(500).json({error: '주문 배송지 정보 수정 실패'});
  }
}

const putOrderStatus = async(req: Request, res: Response) => {
  const {orderId} = req.body;
  console.log('putOrderStatus', req.body);
  try{
    const result = await fetchUpdateOrderStatus(req.body);
    console.log('putOrderStatus result', result);
    res.json(result);
  } catch(err){
    res.status(500).json({error: '주문 배송지 정보 수정 실패'});
  }
}

export default {
  getUserPoints,
  getDeliveryMessage,
  getUserAddress,
  getUserDetailsAddress,
  getOrderProducts,
  getOrderShipping,
  postOrderSingleProduct,
  postOrderDeliveryInfo,
  putOrderStatus,
};
