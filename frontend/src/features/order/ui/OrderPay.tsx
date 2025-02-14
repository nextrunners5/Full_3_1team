import { useState } from "react";
import OrderCouponPoint from "./OrderCouponPoint";
import "./OrderPay.css"
import OrderPrice from "./OrderPrice";
import { useSelector } from "react-redux";
import { selectOrderId, selectTotalPrice } from "../../../pages/order/orderRedux/slice";
import { fetchProcessPayment } from "../api/Order";
// import { RootState } from "../../../pages/order/orderRedux/store";
import { OrderUser } from "../model/OrderModel";

const OrderPay: React.FC<OrderUser> = ({userId}) => {
  // const userId = useSelector((state:RootState) => state.order.user_id);
  const [points, setPoints] = useState<number>(0);
  const totalPrice = useSelector(selectTotalPrice);
  const orderId = useSelector(selectOrderId);


  const handlePointChange = (newPoint: number) => {
    setPoints(newPoint);
  }

  const handlePayment = async() => {
    try{
      const response = await fetchProcessPayment(orderId, totalPrice - points);
      console.log('response handlePatment', response.message);
    } catch(err){
      console.error('결제 에러',err);
      alert('결제 요청 실패');
    }
  }


  return (
    <div className="orderPayContainer">
      <div className="orderPayTitle">결제 금액</div>
      <div className="orderCouponPoint"><OrderCouponPoint userId={userId} points={points} onPointsChange={handlePointChange}/></div>
      <div className="orderPrice"><OrderPrice userId={userId} points={points}/></div>
      <div className="orderBtnContainer">
        <div className="orderBtn" onClick={handlePayment}>결제하기</div>
      </div>
    </div>
  )
}

export default OrderPay;