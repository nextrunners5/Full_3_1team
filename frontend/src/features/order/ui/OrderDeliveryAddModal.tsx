import "./OrderDeliveryModal.css"
import React from "react";
import { IoClose } from "react-icons/io5";
import { Address } from '../../../features/address/model/Address';
import OrderDeliveryEditModal from './OrderDeliveryEditModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (address: Address) => void;
  addresses: Address[];
  onDelete: (addressId: string) => void;
}

const OrderDeliveryAddModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelect,
  addresses,
  onDelete
}) => {
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editAddress, setEditAddress] = React.useState<Address | null>(null);

  if (!isOpen) return null;

  const handleEdit = (address: Address) => {
    setEditAddress(address);
    setShowEditModal(true);
  };

  const handleAddNew = () => {
    setEditAddress(null);
    setShowEditModal(true);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>배송지 선택</h2>
        
        {/* 배송지 목록 */}
        <div className="address-list">
          {addresses.map((address) => (
            <div key={address.address_id} className="address-item">
              {address.is_default && <span className="default-badge">기본 배송지</span>}
              <div className="address-info">
                <p className="address-name">{address.address_name}</p>
                <p className="recipient">{address.recipient_name}</p>
                <p className="address">
                  {address.address} {address.detailed_address}
                </p>
                <p className="phone">{address.recipient_phone}</p>
              </div>
              <div className="address-actions">
                <button onClick={() => onSelect(address)}>선택</button>
                <button onClick={() => handleEdit(address)}>수정</button>
                {!address.is_default && (
                  <button onClick={() => onDelete(address.address_id)}>삭제</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 새 배송지 추가 버튼 */}
        <button className="add-address-btn" onClick={handleAddNew}>
          + 새 배송지 추가
        </button>

        <button className="close-btn" onClick={onClose}>닫기</button>
      </div>

      {/* 배송지 추가/수정 모달 */}
      {showEditModal && (
        <OrderDeliveryEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          initialData={editAddress}
          isEditing={!!editAddress}
        />
      )}
    </div>
  );
}

export default OrderDeliveryAddModal;