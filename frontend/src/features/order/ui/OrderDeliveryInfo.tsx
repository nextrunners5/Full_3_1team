import React, { useEffect, useState } from 'react';
import "./OrderDeliveryInfo.css";
import { OrderDeliveryProps, UserAddressInfo } from "../model/OrderModel";
import OrderDeliveryModal from "./OrderDeliveryModal";
import { fetchDeliveryMessage, fetchUserDetailsAddress } from "../api/Order";
import AddressModal from '../../address/ui/AddressModal';
import axiosInstance from '../../../shared/axios/axios';
import { Address } from '../../address/model/Address';

const OrderDeliveryInfo: React.FC<OrderDeliveryProps> = ({
  userId,
  onAddressSelect,
  onMessageSelect
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [deliveryMessage, setDeliveryMessage] = useState<any[]>([]);
  const [messageForm, setMessageForm] = useState({ description: "" });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);

  // 배송지 목록 조회
  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get('/api/addresses');
      if (response.data.success) {
        setAddresses(response.data.addresses);
        // 기본 배송지 설정
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

  // 배송 메시지 목록 조회
  const fetchMessages = async () => {
    try {
      const messages = await fetchDeliveryMessage();
      setDeliveryMessage(messages);
    } catch (error) {
      console.error('배송 메시지 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchMessages();
  }, [userId]);

  // 배송지 추가/수정 처리
  const handleAddressSubmit = async (addressData: Address) => {
    try {
      if (editAddress) {
        // 수정
        const response = await axiosInstance.put(`/api/addresses/${editAddress.address_id}`, addressData);
        if (response.data.success) {
          setEditModalOpen(false);
          fetchAddresses();
        }
      } else {
        // 추가
        const response = await axiosInstance.post('/api/addresses', addressData);
        if (response.data.success) {
          setModalOpen(false);
          fetchAddresses();
        }
      }
    } catch (error) {
      console.error('배송지 저장 실패:', error);
    }
  };

  // 배송지 삭제
  const handleDeleteAddress = async (addressId: number) => {
    try {
      const response = await axiosInstance.delete(`/api/addresses/${addressId}`);
      if (response.data.success) {
        fetchAddresses();
        setEditModalOpen(false);
      }
    } catch (error) {
      console.error('배송지 삭제 실패:', error);
    }
  };

  // 배송 메시지 변경
  const handleMessageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMessageForm({ description: e.target.value });
    onMessageSelect(e.target.value);
  };

  return (
    <div className="orderDeliveryContainer">
      <div className="orderDeliveryTitle">배송 정보</div>
      <div className="orderDeliveryBody">
        {selectedAddress && (
          <div className="addressBody">
            <div>
              <div className="recipient">{selectedAddress.recipient_name}</div>
              <div className="address">{selectedAddress.address} {selectedAddress.detailed_address}</div>
              <div className="phoneNumber">{selectedAddress.recipient_phone}</div>
            </div>
            <button className="deliveryChange" onClick={() => setModalOpen(true)}>
              배송지 변경
            </button>
          </div>
        )}
        <div className="deliveryRequest">
          <div className="requestTitle">배송 요청사항</div>
          <div className="requestToggle">
            <select 
              name="messageStatus" 
              value={messageForm.description} 
              onChange={handleMessageChange}
              title="배송 메시지 선택"
            >
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

      {/* 배송지 선택 모달 */}
      <OrderDeliveryModal
        open={modalOpen}
        close={() => setModalOpen(false)}
        header="배송지 선택"
        userAddressDetails={addresses}
        onSelect={(address) => {
          setSelectedAddress(address);
          onAddressSelect(address);
        }}
        onNewAddress={(address) => {
          setAddresses([...addresses, address]);
          setSelectedAddress(address);
          onAddressSelect(address);
        }}
      />

      {/* 배송지 추가/수정 모달 */}
      {(modalOpen || editModalOpen) && (
        <AddressModal
          onClose={() => {
            setModalOpen(false);
            setEditModalOpen(false);
            setEditAddress(null);
          }}
          onSubmit={handleAddressSubmit}
          onDelete={handleDeleteAddress}
          initialData={editAddress}
          isEditing={!!editAddress}
        />
      )}
    </div>
  );
};

export default OrderDeliveryInfo;