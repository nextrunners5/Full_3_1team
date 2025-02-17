import { useEffect, useState } from "react";
import OrderCouponPoint from "./OrderCouponPoint";
import "./OrderPay.css"
import OrderPrice from "./OrderPrice";
import { useSelector } from "react-redux";
import { selectOrderId } from "../../../pages/order/orderRedux/slice";
import { fetchInsertDelivery, fetchUpdateInfo } from "../api/Order";
// import { RootState } from "../../../pages/order/orderRedux/store";
import { OrderPayProps } from "../model/OrderModel";
import { loadTossPayments } from "@tosspayments/payment-sdk";

const OrderPay: React.FC<OrderPayProps> = ({userId, selectedAddress, selectedMessage}) => {
  // const userId = useSelector((state:RootState) => state.order.user_id);
  const [points, setPoints] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  // const totalPrice = useSelector(selectTotalPrice);
  const orderId = useSelector(selectOrderId);


  const handlePointChange = (newPoint: number) => {
    setPoints(newPoint);
  }

  useEffect(() => {
    console.log('setFinalPrice 업데이트', finalPrice);
  },[finalPrice]);
  
  const handleFinalPriceChange = (newFinalPrice: number) => {
    setFinalPrice(newFinalPrice);
    console.log('setFinalPrice', finalPrice);
  };



  const handlePayment = async () => {
    if (!selectedAddress) {
      alert("주소를 선택해주세요.");
      return;
    }
    
    setIsLoading(true);
    try {
      const tossPayments = await loadTossPayments(import.meta.env.VITE_TOSS_CLIENT_KEY);

      // const finalPrice = totalPrice - points ;
      const final_price = finalPrice;

      const encodedAddress = encodeURIComponent(JSON.stringify(selectedAddress));

      // 결제 요청
      await tossPayments.requestPayment("카드", {
        orderId: `${orderId}`,
        orderName: "구매 상품",
        amount: final_price,
        customerName: `${userId}`, // 실제 환경에서는 사용자 이름을 받아야 함
        // successUrl: `${window.location.origin}/payments/success`,
        successUrl: `${window.location.origin}/payments/success?orderId=${orderId}&address=${encodedAddress}&message=${encodeURIComponent(selectedMessage)}`,
        failUrl: `${window.location.origin}/payments/fail`,
        
      });

      await fetchUpdateInfo(orderId);
      console.log('fetchUpdateInfo 실행됨');
      await fetchInsertDelivery(orderId, selectedAddress, selectedMessage);
      console.log('fetchInsertDelivery 실행됨');

    } catch (error) {
      console.error("결제 요청 실패:", error);
      alert("결제 요청 실패");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="orderPayContainer">
      <div className="orderPayTitle">결제 금액</div>
      <div className="orderCouponPoint"><OrderCouponPoint userId={userId} points={points} onPointsChange={handlePointChange}/></div>
      <div className="orderPrice"><OrderPrice userId={userId} points={points} onFinalPriceChange={handleFinalPriceChange}/></div>
      <div className="orderBtnContainer">
        <button className="orderBtn" onClick={handlePayment} disabled={isLoading}>결제하기</button>
      </div>
    </div>
  )
}

export default OrderPay;