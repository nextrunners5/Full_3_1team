import { useEffect, useState } from "react";
import "./OrderProductInfo.css"
import { OrderProducts } from "../model/OrderModel";
import { fetchOrderProducts } from "../api/Order";
import { useDispatch } from "react-redux";
import { updateOrderInfo } from "../../../pages/order/orderRedux/slice";

const OrderProduct: React.FC = () => {
  
  const dispatch = useDispatch();
  const [orderProducts, setOrderProducts] = useState<OrderProducts[]>([]);

  useEffect(() => {
    const getOrderProduct = async () => {
      try{
        const productInfo = await fetchOrderProducts();
        console.log('제품 정보 가져오기 성공:', productInfo);
        if(productInfo && productInfo.length > 0) {
          const transformedProduct = productInfo.map(product => ({
            ...product,
            final_price : Number(product.final_amount.toString().replace(/,/g, '')) / product.product_count,
          }));
          setOrderProducts(transformedProduct);
          console.log('제품정보', transformedProduct);
          dispatch(updateOrderInfo(transformedProduct));
        }
        console.log('제품 정보 : ', productInfo);
      } catch(err){
        console.error('주문하려는 제품의 정보를 가져오지 못했습니다.', err);
      }
    };
    getOrderProduct();
  },[dispatch]);


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
            <div className="productType">종류: 강아지용 | 사이즈: {data.option_size} {data.option_color && `| 색상: ${data.option_color}`}</div>
            <div className="productPrice">{data.final_price.toLocaleString()}원 x {data.product_count}개</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrderProduct;