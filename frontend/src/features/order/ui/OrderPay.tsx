import OrderCouponPoint from "./orderCouponPoint";
import "./OrderPay.css"
import OrderPrice from "./OrderPrice";

const OrderPay: React.FC = () => {
  return (
    <div className="orderPayContainer">
      <div className="orderPayTitle">결제 금액</div>
      <div className="orderCouponPoint"><OrderCouponPoint/></div>
      <div className="orderPrice"><OrderPrice/></div>
      <div className="orderFinalPrice"></div>
      <div className="orderBtnContainer">
        <div className="orderBtn">결제하기</div>
      </div>
    </div>
  )
}

export default OrderPay;