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

  const handleAddressChange = (address: Address) => {
    setSelectedAddress(address);
  }

  const handleMessageChange = (message: string) => {
    setSelectedMessage(message);
  }

  // 결제 성공 처리
  const handlePaymentSuccess = async (response: PaymentResponse) => {
    try {
      const orderData = {
        // 주문 정보 구조 정의
        // ...
      };
      
      navigate('/order/complete', {
        state: { 
          orderId: response.data.orderId,
          orderInfo: orderData 
        } 
      });
    } catch (error) {
      console.error('Payment processing failed:', error);
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