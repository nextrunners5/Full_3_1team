import "./OrderPrice.css"

const OrderPrice: React.FC = () => {
  return (
    <div>
      <div className="orderPriceContainer">
        <div className="orderProductPriceContainer">
          <div className="orderProductPriceTitle">상품 금액</div>
          <div className="orderProductPrice">89,000원</div>
        </div>
        <div className="orderCouponPriceContainer">
          <div className="orderCouponPriceTitle">쿠폰 할인</div>
          <div className="orderCouponPrice">-8,900원</div>
        </div>
        <div className="orderDeliveryPriceContainer">
          <div className="orderDeliveryPriceTitle">배송비</div>
          <div className="orderDeliveryPrice">3,000원</div>
        </div>
      </div>
      <div className="orderFinalPriceContainer">
        <div className="orderFinalPriceTitle">최종 결제 금액</div>
        <div className="orderFinalPrice">92,000원</div>
      </div>
    </div>
  )
}

export default OrderPrice;