import { useEffect, useState } from "react";
import "./OrderDeliveryInfo.css"
import OrderDeliveryModal from "./OrderDeliveryModal";
import axiosInstance from "../../../shared/axios/axios";
import {Common, DeliveryForm, UserAddressInfo} from "../model/OrderModel";
import { fetchDeliveryMessage, fetchDetailsAddress } from "../api/Order";
// import OrderDeliveryAddModal from "./OrderDeliveryAddModal";
// import OrderDeliveryUpdateModal from "./OrderDeliveryUpdateModal";


const OrderDeliveryInfo: React.FC = () => {

  const [deliveryMessage, setDeliveryMessage] = useState<Common[]>([]);
  const [messageForm, setMessageForm] = useState<DeliveryForm>({delivery_message_id: 0, description: '배송 메시지를 선택해 주세요.'});
  // const [userAddress, setUserAddress] = useState<UserAddressInfo[]>([]);
  const [userAddressDetails, setUserAddressDetails] = useState<UserAddressInfo[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<UserAddressInfo|null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // useEffect(() => {
  //   const getUserAddress = async() => {
  //     try{
  //       const address = await fetchDetailsAddress();
  //       console.log('주소 데이터 가져오기 성공:', address);
  //       if(address && address.length > 0){
  //         setUserAddressDetails(address);
  //       }
  //       setIsLoading(false);
  //       console.log('주소:', address);
  //     } catch(err){
  //       console.log('사용자의 주소정보를 가져오지 못했습니다.', err);
  //       setIsLoading(false);
  //     }
  //   };
  //   getUserAddress();
  // },[])

  useEffect(() => {
    const getUserAddress = async() => {
      try{
        const addressDetails = await fetchDetailsAddress();
        console.log('주소 상세 데이터 가져오기 성공:', addressDetails);
        if(addressDetails && addressDetails.length > 0){
          
          setUserAddressDetails(addressDetails);

          const defaultAddress = addressDetails.find(addr => addr.is_default === 1)
          if(defaultAddress){
            console.log('origin default address', defaultAddress);
            setSelectedAddress(defaultAddress);
            console.log('Selected default address', defaultAddress);
          } else {
            console.log('default address not found');
          }
        }
        setIsLoading(false);
        console.log('상세 주소:', addressDetails);
      } catch(err){
        console.log('사용자의 주소 상세 정보를 가져오지 못했습니다.', err);
        setIsLoading(false);
      }
    };
    getUserAddress();
  },[]);

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
  };

  const openModal = () => { setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); };

  const handleAddressChange = (address: UserAddressInfo) => {
    setSelectedAddress(address);
  };

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
            {/* <div className="recipient">{userAddress[0].recipient_name}</div> */}
            <div className="recipient">{selectedAddress.recipient_name}</div>
            <div className="addressBody">
              {/* <div className="address">{userAddress[0].address}</div> */}
              <div className="address">{selectedAddress.address}</div>
              <button className="deliveryChange" onClick={openModal}>배송지 변경</button>
              <OrderDeliveryModal open={modalOpen} close={closeModal} header="배송지 선택" userAddressDetails = {userAddressDetails}  onSelect={handleAddressChange}/>
            </div>
            {/* <div className="phoneNumber">{userAddress[0].recipient_phone}</div> */}
            <div className="phoneNumber">{selectedAddress.recipient_phone}</div>
          </div>
          ) : (
            <div>주소 정보가 없습니다.</div>
          )}
        </div>
        <div className="deliveryRequest">
          <div className="requestTitle">배송 요청사항</div>
          <div className="requestToggle">
            <select name="messageStatus" value={messageForm.description} onChange={handleMessageChange}>
              <option value="" className="optionText">배송 메시지를 선택해 주세요</option>
              {deliveryMessage.map((status) => (
                <option key={status.status_code} value={status.description}>
                  {status.description}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDeliveryInfo;