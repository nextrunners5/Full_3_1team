import OrderProduct from "./OrderProductInfo";
import "./Order.css"

const OrderInfo: React.FC = () => {


  return (
    <div className="infoContainer">
      <div className="title">주문 상품 정보</div>
      <div className="midInfo"><OrderProduct/></div>
      
    </div>

  )
}

export default OrderInfo;