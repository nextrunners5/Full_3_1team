import OrderProduct from "./OrderProductInfo";
import "./Order.css"
import { useState } from "react";
const OrderInfo: React.FC = () => {
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const handleTotalPriceChange = (newTotalPrice: number) => {
    setTotalPrice(newTotalPrice);
  }

  return (
    <div className="infoContainer">
      <div className="title">주문 상품 정보</div>
      <div className="midInfo"><OrderProduct total_price={totalPrice} onTotalPriceChange={handleTotalPriceChange}/></div>
      
    </div>

  )
}

export default OrderInfo;