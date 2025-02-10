import { useState } from "react";
import OrderCouponPoint from "./OrderCouponPoint";
import "./OrderPay.css"
import OrderPrice from "./OrderPrice";

const OrderPay: React.FC = () => {
  const [points, setPoints] = useState<number>(0);
  // const [totalPrice, setTotalPrice] = useState<number>(0);
  const handlePointChange = (newPoint: number) => {
    setPoints(newPoint);
  }

  return (
    <div className="orderPayContainer">
      <div className="orderPayTitle">결제 금액</div>
      <div className="orderCouponPoint"><OrderCouponPoint points={points} onPointsChange={handlePointChange}/></div>
      <div className="orderPrice"><OrderPrice points={points}/></div>
      <div className="orderBtnContainer">
        <div className="orderBtn">결제하기</div>
      </div>
    </div>
  )
}

export default OrderPay;