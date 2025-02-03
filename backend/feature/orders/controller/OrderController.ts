//컨트롤러는 사용자로부터의 요청을 받아서 처리하고, 적절한 응답을 반환하는 역할을 합니다. 
//비즈니스 로직을 서비스 계층에 위임하고, 서비스로부터 받은 결과를 클라이언트에 반환합니다.
import { Request, Response } from 'express';
import { fetchUserPoints, fetchDeliveryMessage, fetchUserAddress, fetchOrderProducts } from '../services/OrderService';

const getUserPoints = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;

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
  const userId = req.query.userId as string;
  try{
    const userAddress = await fetchUserAddress(userId);
    res.json(userAddress);

    console.log('userAddress: ', userAddress);
  } catch(err){
    res.status(500).json({error: '배송정보 불러오기 실패'});
  }
};

const getOrderProducts = async(req: Request, res: Response) => {
  try{
    const orderProducts = await fetchOrderProducts();
  } catch(err){
    res.status(500).json({error: '주문 상품 정보 불러오기 실패'});
  }
};

export default {
  getUserPoints,
  getDeliveryMessage,
  getUserAddress,
  getOrderProducts,
};
