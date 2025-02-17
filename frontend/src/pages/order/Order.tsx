import OrderInfo from "../../features/order/ui/Order";
import OrderDeliveryInfo from "../../features/order/ui/OrderDeliveryInfo";
import OrderPay from "../../features/order/ui/OrderPay";
import Footer from "../../widgets/footer/Footer";
import "./Order.css"
import { useSelector} from "react-redux";
import { RootState } from "./orderRedux/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const Order: React.FC = () => {
  const userId = useSelector((state: RootState)=>state.order.user_id);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Order.tsx 아이디 변경 감지: ', userId);
  },[userId]);

  const handleAddressChange = (address: any) => {
    setSelectedAddress(address);
  }

  const handleMessageChange = (message: any) => {
    setSelectedMessage(message);
  }

  // 결제 성공 처리
  const handlePaymentSuccess = async (response: any) => {
    try {
      // ... 결제 처리 로직 ...

      if (response.data.success) {
        // 결제 성공 시 주문 완료 페이지로 이동
        navigate('/order/complete', { 
          state: { 
            orderId: response.data.orderId,
            orderInfo: orderData 
          } 
        });
      }
    } catch (error) {
      // ... 에러 처리 ...
    }
  };

  return (
    // <Provider store={orderStore}>
      <div className="mainContainer">
        <header></header>
        <body className="bodyContainer">
          <div className="orderContainer">
            <div className="orderLeft">
              <div className="productInfo"><OrderInfo userId={userId}/></div>
              <div className="deliveryInfo"><OrderDeliveryInfo userId={userId} addressChange={handleAddressChange} messageChange={handleMessageChange}/></div>
              <div className="payChoice"></div>
            </div>
            <div className="orderRight">
              <div className="orderPrice"><OrderPay userId={userId} selectedAddress={selectedAddress} selectedMessage={selectedMessage}/></div>
            </div>
          </div>
        </body>
        <footer><Footer/></footer>
      </div>
    // </Provider>

  )
}

export default Order;