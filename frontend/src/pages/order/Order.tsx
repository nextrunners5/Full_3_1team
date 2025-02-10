import OrderInfo from "../../features/order/ui/Order";
import OrderDeliveryInfo from "../../features/order/ui/OrderDeliveryInfo";
import OrderPay from "../../features/order/ui/OrderPay";
import Footer from "../../widgets/footer/Footer";
import "./Order.css"
import {Provider} from "react-redux";
import orderStore from "./orderRedux/store";

const Order: React.FC = () => {

  return (
    <Provider store={orderStore}>
      <div className="mainContainer">
        <header></header>
        <body className="bodyContainer">
          <div className="orderContainer">
            <div className="orderLeft">
              <div className="productInfo"><OrderInfo/></div>
              <div className="deliveryInfo"><OrderDeliveryInfo/></div>
              <div className="payChoice"></div>
            </div>
            <div className="orderRight">
              <div className="orderPrice"><OrderPay/></div>
            </div>
          </div>
        </body>
        <footer><Footer/></footer>
      </div>
    </Provider>

  )
}

export default Order;