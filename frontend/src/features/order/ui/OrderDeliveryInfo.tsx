import React, { useState, useEffect } from 'react';
import "./OrderDeliveryInfo.css"
import OrderDeliveryAddModal from "./OrderDeliveryAddModal";
import axiosInstance from "../../../shared/axios/axios";
import {Common, DeliveryForm, OrderDeliveryInfoProps, UserAddressInfo} from "../model/OrderModel";
import { fetchDeliveryMessage, fetchDetailsAddress } from "../api/Order";
import { Address } from '../../../features/address/model/Address';

interface Props {
  onAddressSelect: (address: Address) => void;
  onMessageSelect: (message: string) => void;
}

const OrderDeliveryInfo: React.FC<Props> = ({ onAddressSelect, onMessageSelect }) => {
  const [deliveryMessage, setDeliveryMessage] = useState<Common[]>([]);
  const [messageForm, setMessageForm] = useState<DeliveryForm>({delivery_message_id: 0, description: '배송 메시지를 선택해 주세요.'});
  const [userAddressDetails, setUserAddressDetails] = useState<UserAddressInfo[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<UserAddressInfo|null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    const getUserAddress = async() => {
      try{
        console.log('🚀 getUserAddress 실행됨');
        console.log('프론트 주문 배송지 유저', userId);
        const addressDetails = await fetchDetailsAddress(userId);
        console.log('주소 상세 데이터 가져오기 성공:', addressDetails);
        if(addressDetails && addressDetails.length > 0){
          
          setUserAddressDetails(addressDetails);

          const defaultAddress = addressDetails.find(addr => !!addr.is_default)
          if(defaultAddress){
            console.log('origin default address', defaultAddress);
            setSelectedAddress(defaultAddress);
            onAddressSelect(defaultAddress);
            console.log('Selected default address', defaultAddress);
          } else {
            console.log('default address not found', defaultAddress);
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
    onMessageSelect(value);
  };

  const handleAddressSelect = (address: UserAddressInfo) => {
    setSelectedAddress(address);
    onAddressSelect(address);
    setShowModal(false);
  };

  const handleNewAddress = (newAddress: UserAddressInfo) => {
    setUserAddressDetails((prev) => [...prev, newAddress]);
    setSelectedAddress(newAddress);
    onAddressSelect(newAddress);
  }

  // 배송지 목록 조회
  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get('/api/addresses');
      if (response.data.success) {
        setAddresses(response.data.addresses);
        // 기본 배송지 자동 선택
        const defaultAddress = response.data.addresses.find((addr: Address) => addr.is_default);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
          onAddressSelect(defaultAddress);
        }
      }
    } catch (error) {
      console.error('배송지 조회 실패:', error);
    }
  };

  // 배송지 삭제
  const handleDeleteAddress = async (addressId: string) => {
    try {
      const response = await axiosInstance.delete(`/api/addresses/${addressId}`);
      if (response.data.success) {
        fetchAddresses();
      }
    } catch (error) {
      console.error('배송지 삭제 실패:', error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

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
              <button className="deliveryChange" onClick={() => setShowModal(true)}>배송지 변경</button>
            </div>
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
      <OrderDeliveryAddModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleAddressSelect}
        addresses={addresses}
        onDelete={handleDeleteAddress}
      />
    </div>
  )
}

export default OrderDeliveryInfo;