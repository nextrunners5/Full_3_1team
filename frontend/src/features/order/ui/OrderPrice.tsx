import { useEffect, useState } from "react";
import { OrderPriceProps, OrderShippingFee } from "../model/OrderModel";
import "./OrderPrice.css"
import { fetchShippingFee } from "../api/Order";
import { useSelector } from "react-redux";
// import { RootState } from "../../../pages/order/orderRedux/store";
import { selectTotalPrice } from "../../../pages/order/orderRedux/slice";


const OrderPrice: React.FC<OrderPriceProps> = ({userId,points}) => {
  const [shippingFee, setShippingFee] = useState<OrderShippingFee>({shipping_fee: 0});
  const orderInfo = useSelector(selectTotalPrice);
  // const userId = useSelector((state:RootState) => state.order.user_id);

  useEffect(()=> {
    const getShippingFee = async() => {
      try{
        const fee = await fetchShippingFee(userId);
        if(fee && fee.length > 0){
          setShippingFee({ shipping_fee: Number(fee[0].shipping_fee.toString().replace(/,/g,'')) });
        }
        // console.log('배송비 가져오기 setShippingFee: ', shippingFee);
        // console.log('total', orderInfo);
      } catch(err){
        console.error('배송비를 가져오지 못했습니다.', err);
      }
    };
    getShippingFee();
  },[]);
  
  return (
    <div>
      <div className="orderPriceContainer">
        <div className="orderProductPriceContainer">
          <div className="orderProductPriceTitle">상품 금액</div>
          <div className="orderProductPrice">{orderInfo.toLocaleString()}원</div>
        </div>
        <div className="orderCouponPriceContainer">
          <div className="orderCouponPriceTitle">쿠폰 할인</div>
          <div className="orderCouponPrice">-8,900원</div>
        </div>
        <div className="orderPointPriceContainer">
          <div className="orderPointPriceTitle">포인트</div>
          <div className="orderPointPrice">-{points}원</div>
        </div>
        <div className="orderDeliveryPriceContainer">
          <div className="orderDeliveryPriceTitle">배송비</div>
          <div className="orderDeliveryPrice">{shippingFee.shipping_fee.toLocaleString()}원</div>
        </div>
      </div>
      <div className="orderFinalPriceContainer">
        <div className="orderFinalPriceTitle">최종 결제 금액</div>
        <div className="orderFinalPrice">{(orderInfo - (points + shippingFee.shipping_fee)).toLocaleString()}원</div>
      </div>
    </div>
  )
}

export default OrderPrice;