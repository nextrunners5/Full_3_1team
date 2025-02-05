import { useEffect, useState } from "react";
import "./OrderProductInfo.css"
import { OrderProducts, OrderProductsProps } from "../model/OrderModel";
import { fetchOrderProducts } from "../api/Order";

const OrderProduct: React.FC<OrderProductsProps> = ({onTotalPriceChange}) => {
  const [orderProducts, setOrderProducts] = useState<OrderProducts[]>([]);

  useEffect(() => {
    const getOrderProduct = async () => {
      try{
        const productInfo = await fetchOrderProducts();
        console.log('제품 정보 가져오기 성공:', productInfo);
        if(productInfo && productInfo.length > 0) {
          setOrderProducts(productInfo);
          const total = productInfo.reduce((acc, product) => acc + (product.final_price * product.quantity), 0);
          // setTotalPrice(total);
          onTotalPriceChange(total);
        }
        console.log('제품 정보 : ', productInfo);
      } catch(err){
        console.error('주문하려는 제품의 정보를 가져오지 못했습니다.', err);
      }
    };
    getOrderProduct();
  },[onTotalPriceChange]);

  return (
    <div className="orderProductContainer">
      {orderProducts.map((data,index)=> (
        <div className="repeatProduct" key={index}>
          <div className="midLeft">
            <img src="" alt="" className="productImg"/>
          </div>
          <div className="midRight">
            <div className="productName">{data.product_name}</div>
            <div className="productName">{data.product_id}</div>
            <div className="productType">종류: 강아지용 | 사이즈: M</div>
            <div className="productPrice">{data.final_price}원 x {data.quantity}개</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrderProduct;