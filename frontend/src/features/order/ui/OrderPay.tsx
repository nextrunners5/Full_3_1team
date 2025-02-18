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
import { useNavigate } from "react-router-dom";

const OrderPay: React.FC<OrderPayProps> = ({userId, selectedAddress, selectedMessage}) => {
  // const userId = useSelector((state:RootState) => state.order.user_id);
  const [points, setPoints] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  // const totalPrice = useSelector(selectTotalPrice);
  const orderId = useSelector(selectOrderId);
  const navigate = useNavigate();


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

  // 결제 성공 처리 함수
  const handlePaymentSuccess = async (response: PaymentResponse) => {
    try {
      // 결제 성공 후 재고 감소 처리
      await updateProductStock(orderItems.map(item => ({
        product_id: item.product_id,
        product_count: item.product_count,
        option_color: item.option_color,
        option_size: item.option_size
      })));

      // 결제 완료 페이지로 이동
      navigate('/order/complete', {
        state: { 
          orderId: response.orderId,
          orderInfo: {
            items: orderItems,
            delivery_info: selectedAddress,
            total_amount: totalAmount
          }
        } 
      });
    } catch (error) {
      console.error('결제 처리 실패:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    }
  };

  // 결제 시도 전 재고 확인
  const handlePayment = async () => {
    try {
      // 재고 확인
      const hasStock = await checkStock(orderItems);
      if (!hasStock) {
        alert('일부 상품의 재고가 부족합니다.');
        return;
      }

      // 여기서 결제 진행
      // ...결제 로직...

    } catch (error) {
      console.error('결제 처리 실패:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
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