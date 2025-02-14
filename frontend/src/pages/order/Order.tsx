import OrderInfo from "../../features/order/ui/Order";
import OrderDeliveryInfo from "../../features/order/ui/OrderDeliveryInfo";
import OrderPay from "../../features/order/ui/OrderPay";
import Footer from "../../widgets/footer/Footer";
import "./Order.css"
import { useSelector} from "react-redux";
import { RootState } from "./orderRedux/store";
import { useEffect } from "react";


const Order: React.FC = () => {
  const userId = useSelector((state: RootState)=>state.order.user_id);


  useEffect(() => {
    console.log('Order.tsx 아이디 변경 감지: ', userId);
  },[userId]);

  return (
    // <Provider store={orderStore}>
      <div className="mainContainer">
        <header></header>
        <body className="bodyContainer">
          <div className="orderContainer">
            <div className="orderLeft">
              <div className="productInfo"><OrderInfo userId={userId}/></div>
              <div className="deliveryInfo"><OrderDeliveryInfo userId={userId}/></div>
              <div className="payChoice"></div>
            </div>
            <div className="orderRight">
              <div className="orderPrice"><OrderPay userId={userId}/></div>
            </div>
          </div>
        </body>
        <footer><Footer/></footer>
      </div>
    // </Provider>

  )
}

export default Order;