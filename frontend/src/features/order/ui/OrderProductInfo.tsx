import { useEffect, useState } from "react";
import "./OrderProductInfo.css"
import { OrderProducts } from "../model/OrderModel";
import { fetchOrderProducts } from "../api/Order";

const OrderProduct: React.FC = () => {

  const [orderProducts, setOrderProducts] = useState<OrderProducts[]>([]);
  useEffect(() => {
    const getOrderProduct = async () => {
      try{
        const productInfo = await fetchOrderProducts();
        console.log('제품 정보 가져오기 성공:', productInfo);
        if(productInfo && productInfo.length > 0) {
          setOrderProducts(productInfo);
        }
        console.log('제품 정보 : ', productInfo);
      } catch(err){
        console.error('주문하려는 제품의 정보를 가져오지 못했습니다.', err);
      }
    };
    getOrderProduct();
  },[]);

  return (
    <div className="orderProductContainer">
      <div className="repetProduct">
        <div className="midLeft">
          <img src="" alt="" className="productImg"/>
        </div>
        <div className="midRight">
          <div className="productName">프리미엄 반려동물 장난감 세트</div>
          <div className="productType">종류: 강아지용 | 사이즈: M</div>
          <div className="productPrice">89,000원 x 1개</div>
        </div>
      </div>
    </div>
  )
}

export default OrderProduct;