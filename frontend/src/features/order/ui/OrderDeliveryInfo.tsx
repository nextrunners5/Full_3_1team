import { useEffect, useState } from "react";
import "./OrderDeliveryInfo.css"
import OrderDeliveryModal from "./OrderDeliveryModal";
import { FaPlus } from "react-icons/fa6";
import { BsPencilSquare } from "react-icons/bs";
import axiosInstance from "../../../shared/axios/axios";
import {Common, DeliveryForm, UserAddressInfo} from "../model/OrderModel";
import { fetchAddress, fetchDeliveryMessage } from "../api/Order";
import OrderDeliveryAddModal from "./OrderDeliveryAddModal";
import OrderDeliveryUpdateModal from "./OrderDeliveryUpdateModal";


const OrderDeliveryInfo: React.FC = () => {

  const [deliveryMessage, setDeliveryMessage] = useState<Common[]>([]);
  const [messageForm, setMessageForm] = useState<DeliveryForm>({delivery_message_id: 0, description: '배송 메시지를 선택해 주세요.'});
  const [userAddress, setUserAddress] = useState<UserAddressInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const getUserAddress = async() => {
      try{
        const address = await fetchAddress();
        console.log('주소 데이터 가져오기 성공:', address);
        if(address && address.length > 0){
          setUserAddress(address);
        }
        setIsLoading(false);
        console.log('주소:', address);
      } catch(err){
        console.log('사용자의 주소정보를 가져오지 못했습니다.', err);
        setIsLoading(false);
      }
    };
    getUserAddress();
  },[])

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

  // const [selectRadio, setSelectRadio] = useState<string | null>(null)

  // const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSelectRadio(e.target.value);
  // };


  
  const openModal = () => { setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); };
  const openAddModal = () => {setAddModalOpen(true); };
  const closeAddModal = () => {setAddModalOpen(false); };
  const openUpdateModal = () => {setUpdateModalOpen(true); };
  const closeUpdateModal = () => {setUpdateModalOpen(false); };

  return (
    <div className="orderDeliveryContainer">
      <div className="orderDeliveryTitle">
        배송 정보
      </div>
      <div className="orderDeliveryBody">
        <div className="deliveryInfo">
          {isLoading ? (
            <div>로딩 중...</div>
          ) : userAddress.length > 0 ? (
          <div>
            <div className="recipient">{userAddress[0].recipient_name}</div>
            <div className="addressBody">
              {/* <div className="address">서울특별시 강남구 테헤란로 123</div> */}
              <div className="address">{userAddress[0].address}</div>
              <button className="deliveryChange" onClick={openModal}>배송지 변경</button>
              <OrderDeliveryModal open={modalOpen} close={closeModal} header="배송지 선택">
                <div className="orderDeliveryBody">
                  <form className="orderDeliveryBody">
                    <label className="orderDeliverySelectForm">
                      <div className="formContainer">
                        {/* <input className='selectRadio' type="radio" name="radioOption" value="1" checked onChange={handleRadioChange}/> */}
                        <span>집</span>
                        <div className="selectDeliveryInfo">
                          <div className="deliveryName">김민수</div>
                          <div className="deliveryDetail">서울특별시 강남구 테헤란로 123 우리빌딩 456호</div>
                          <div className="deliveryPhone">010-1234-5678</div>
                        </div>
                      </div>
                    </label>
                    <label className="orderDeliverySelectForm">
                      <div className="formContainer">
                        <input className='selectRadio' type="radio" name="radioOption" value="1"/><span>집</span>
                        <div className="selectDeliveryInfo">
                          <div className="deliveryName">홍길동</div>
                          <div className="deliveryDetail">서울특별시 강남구 테헤란로 123 우리빌딩 456호</div>
                          <div className="deliveryPhone">010-1234-5678</div>
                        </div>
                      </div>
                    </label>
                  </form>
                  <div className="changeDeliveryContainer">
                    <div className="addDelivery">
                      <FaPlus />
                      <div className="addDeliveryTitle" onClick={openAddModal}>새 배송지 추가</div>
                      <OrderDeliveryAddModal open={addModalOpen} close={closeAddModal} header="새 배송지 추가">
                      </OrderDeliveryAddModal>
                    </div>
                    <div className="updateDelivery">
                      <BsPencilSquare />
                      <div className="updateDeliveryTitle" onClick={openUpdateModal}>선택 배송지 수정</div>
                      <OrderDeliveryUpdateModal open={updateModalOpen} close={closeUpdateModal} header="배송지 수정">
                      </OrderDeliveryUpdateModal>
                    </div>
                  </div>
                </div>
              </OrderDeliveryModal>
            </div>
            <div className="phoneNumber">{userAddress[0].recipient_phone}</div>
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