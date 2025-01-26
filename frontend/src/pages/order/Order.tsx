import OrderInfo from "../../features/order/ui/Order";
import OrderDeliveryInfo from "../../features/order/ui/OrderDeliveryInfo";
import OrderPay from "../../features/order/ui/OrderPay";
import "./Order.css"

const Order: React.FC = () => {
  return (
    <div className="mainContainer">
      <header></header>
      <body className="bodyContainer">
        <div className="orderLeft">
          <div className="productInfo"><OrderInfo/></div>
          <div className="deliveryInfo"><OrderDeliveryInfo/></div>
          <div className="payChoice"></div>
        </div>
        <div className="orderRight">
          <div className="OcouponeSelect"></div>
          <div className="orderPrice"><OrderPay/></div>
          
        </div>


      </body>
      <footer></footer>
    </div>

  )
}

export default Order;