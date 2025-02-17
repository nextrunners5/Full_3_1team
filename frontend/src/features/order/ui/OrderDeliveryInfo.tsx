import { useEffect, useState } from "react";
import "./OrderDeliveryInfo.css"
import OrderDeliveryModal from "./OrderDeliveryModal";
import axiosInstance from "../../../shared/axios/axios";
import {Common, DeliveryForm, OrderDeliveryInfoProps, UserAddressInfo} from "../model/OrderModel";
import { fetchDeliveryMessage, fetchUserDetailsAddress } from "../api/Order";

const OrderDeliveryInfo: React.FC<OrderDeliveryInfoProps> = ({userId, onAddressSelect, onMessageSelect}) => {

  const [deliveryMessage, setDeliveryMessage] = useState<Common[]>([]);
  const [messageForm, setMessageForm] = useState<DeliveryForm>({delivery_message_id: 0, description: '배송 메시지를 선택해 주세요.'});
  const [userAddressDetails, setUserAddressDetails] = useState<UserAddressInfo[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<UserAddressInfo|null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const getUserDetailsAddress = async () => {
      try {
        const addressData = await fetchUserDetailsAddress(userId);
        if (addressData && addressData.length > 0) {
          setUserAddressDetails(addressData);
          // 기본 배송지 찾기
          const defaultAddress = addressData.find(addr => addr.is_default);
          if (defaultAddress) {
            setSelectedAddress(defaultAddress);
            onAddressSelect(defaultAddress);
          }
        }
        setIsLoading(false);
      } catch (err) {
        console.error('배송지 정보를 가져오지 못했습니다.', err);
        setIsLoading(false);
      }
    };
    getUserDetailsAddress();
  }, [userId]);

  useEffect(() => {
    console.log('Selected address changed:', selectedAddress);
  }, [selectedAddress]);

  useEffect(()=>{
    const getDeliveryMessage = async() => {
      try{
        const data = await fetchDeliveryMessage();
        if(data && data.length > 0){
          setDeliveryMessage(data);
        }
        console.log("배송 메시지: ", data);
      } catch(err){
        console.error('배송 메시지를 불러오지 못했습니다.', err);
      }
    };
    getDeliveryMessage();
  },[]);

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const response = await axiosInstance.get<Common[]>('/api/Orders/DeliveryMessage');
        setDeliveryMessage(response.data);
      } catch (err){
        console.error('상태 데이터를 불러오는 데 실패했습니다.',err);
      }
    };
    
    fetchDelivery();
  },[]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target;
    setMessageForm((prev) => ({
      ...prev,
      description: value,
      [name] : value,
    }))
    onMessageSelect(value);
  };

  const openModal = () => { setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); };

  const handleAddressSelect = (address: UserAddressInfo) => {
    setSelectedAddress(address);
    onAddressSelect(address);
  };

  const handleNewAddress = (address: UserAddressInfo) => {
    setUserAddressDetails((prev) => [...prev, address]);
    setSelectedAddress(address);
    onAddressSelect(address);
  }

  return (
    <div className="orderDeliveryContainer">
      <div className="orderDeliveryTitle">
        배송 정보
      </div>
      <div className="orderDeliveryBody">
        <div className="deliveryInfo">
          {isLoading ? (
            <div>로딩 중...</div>
          ) : selectedAddress ? (
          <div>
            <div className="recipient">{selectedAddress.recipient_name}</div>
            <div className="addressBody">
              <div className="address">{selectedAddress.address} {selectedAddress.detailed_address}</div>
              <button className="deliveryChange" onClick={openModal}>배송지 변경</button>
            </div>
            <div className="phoneNumber">{selectedAddress.recipient_phone}</div>
          </div>
          ) : (
            <button className="deliveryChange" onClick={openModal}>배송지 선택</button>
          )}
        </div>
        <div className="deliveryRequest">
          <div className="requestTitle">배송 요청사항</div>
          <div className="requestToggle">
            <select name="messageStatus" value={messageForm.description} onChange={handleMessageChange} aria-label="배송 메시지 선택">
              <option value="">배송 메시지를 선택해 주세요</option>
              {deliveryMessage.map((status) => (
                <option key={status.status_code} value={status.description}>
                  {status.description}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <OrderDeliveryModal
        open={modalOpen}
        close={closeModal}
        header="배송지 선택"
        userAddressDetails={userAddressDetails}
        onSelect={handleAddressSelect}
        onNewAddress={handleNewAddress}
      />
    </div>
  )
}

export default OrderDeliveryInfo;