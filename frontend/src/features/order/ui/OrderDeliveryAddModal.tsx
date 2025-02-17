import "./OrderDeliveryModal.css"
import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import DaumPostcode from 'react-daum-postcode';
import { Address } from '../../../features/address/model/Address';
import axiosInstance from '../../../shared/axios/axios';

interface ModalProps {
  open: boolean;
  close: () => void;
  header: string;
  // children: React.ReactNode;
}

interface OrderDeliveryAddModalProps {
  onClose: () => void;
  onSubmit: (address: Address) => void;
  onDelete?: (addressId: string | number) => void;
  initialData?: Address | null;
  isEditing?: boolean;
}

const OrderDeliveryAddModal: React.FC<OrderDeliveryAddModalProps> = ({
  onClose,
  onSubmit,
  onDelete,
  initialData,
  isEditing = false
}) => {
  const [addressData, setAddressData] = useState<Address>({
    recipient_name: initialData?.recipient_name || '',
    recipient_phone: initialData?.recipient_phone || '',
    address: initialData?.address || '',
    detailed_address: initialData?.detailed_address || '',
    postal_code: initialData?.postal_code || '',
    address_name: initialData?.address_name || '',
    is_default: initialData?.is_default || false,
    address_id: initialData?.address_id || ''
  });

  const [showPostcode, setShowPostcode] = useState(false);

  const handleComplete = (data: any) => {
    setAddressData(prev => ({
      ...prev,
      address: data.address,
      postal_code: data.zonecode
    }));
    setShowPostcode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && initialData?.address_id) {
        // 수정 모드
        const response = await axiosInstance.put(
          `/api/addresses/${initialData.address_id}`,
          addressData
        );
        if (response.data.success) {
          onSubmit(response.data.address);
        }
      } else {
        // 새로운 주소 추가 모드
        const response = await axiosInstance.post('/api/addresses', addressData);
        if (response.data.success) {
          onSubmit(response.data.address);
        }
      }
      onClose();
    } catch (error) {
      console.error('배송지 저장 실패:', error);
    }
  };

  const handleDelete = async () => {
    if (onDelete && initialData?.address_id) {
      await onDelete(initialData.address_id);
      onClose();
    }
  };

  return (
    <div className={open ? "openModal modal" : "modal"}>
      {open ? (
        <section className="modalSection">
          <header className="modalHeader">
            {header}
            <button onClick={close} className="close">
              <IoClose className="closeIcon"/>
            </button>
          </header>
          <main className="modalMain">
            <form onSubmit={handleSubmit}>
              <div className="newAddress">
                <input type="text" 
                  name="address"/>
                <button>주소 찾기</button>
              </div>
              <div className="recipientContainer">
                <div className="recipientTitle"></div>
                <input type="text"
                  className="recipientForm"/>
              </div>
              <div className="contactContainer">
                <div className="contactTitle"></div>
                <input type="text"
                  className="contactForm"/>
              </div>
              <div className="contactContainer">
                <div className="contactTitle"></div>
                <input type="text"
                  className="contactForm"/>
              </div>

            </form>
          </main>
          <footer className="modalFooter">
            <button onClick={close} className="selectAddress">취소</button>
            <button onClick={close} className="footerClose">저장</button>
          </footer>
        </section>
      ):null}
    </div>
  );
}

export default OrderDeliveryAddModal;