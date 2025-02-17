import "./OrderDeliveryModal.css"
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { UserAddressFormInfo, UserAddressInfo } from "../model/OrderModel";
// import OrderDeliveryAddModal from "./OrderDeliveryAddModal";
// import OrderDeliveryUpdateModal from "./OrderDeliveryUpdateModal";
import { FaPlus } from "react-icons/fa6";
import { BsPencilSquare } from "react-icons/bs";
import AddressModal from "../../address/ui/AddressModal";
import { fetchAddAddress, updateAddress, setDefaultAddress } from "../api/Order";

interface ModalProps {
  open: boolean;
  close: () => void;
  header: string;
  userAddressDetails: UserAddressInfo[];
  onSelect: (address: UserAddressInfo) => void;
  onNewAddress: (address: UserAddressInfo) => void;
  onUpdateAddress: (address: UserAddressInfo) => void;
}

const OrderDeliveryModal: React.FC<ModalProps> = ({
  open, 
  close, 
  header, 
  userAddressDetails, 
  onSelect, 
  onNewAddress,
  onUpdateAddress
}) => {
  const [selectedAddress, setSelectedAddress] = useState<UserAddressInfo | null>(null);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);

  const [addressList, setAddressList] = useState<UserAddressInfo[]>([]);
  useEffect(() => {
    if(open){
      console.log("배송지 목록 데이터:", {
        userAddressDetails,
        addressList
      });
      userAddressDetails.forEach(addr => {
        console.log('배송지 상세:', {
          name: addr.address_name,
          postal: addr.postal_code,
          full: addr.address
        });
      });
      // console.log("address_id", selectedAddress?.address_id);
      // setAddressList(userAddressDetails);
      const defaultAddress = userAddressDetails.find((addr) => addr.is_default === true);
      if(defaultAddress) {
        setSelectedAddress(defaultAddress);
        console.log('선택된 주소', defaultAddress);
      }
      setAddressList(userAddressDetails);
    }
  },[open, userAddressDetails]);

  const handleAddressChange = (address:UserAddressInfo) => {
    setSelectedAddress(address);
  };

  const handleSelect = () => {
    if(selectedAddress){
      onSelect(selectedAddress);
      close();
    }
  }

  const openAddModal = () => {setAddModalOpen(true); };
  const closeAddModal = () => {setAddModalOpen(false); };

  const openUpdateModal = () => {
    if (!selectedAddress) {
      alert("수정할 배송지를 선택해주세요.");
      return;
    }
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
  };

  const handleSetDefaultAddress = async (addressId: number) => {
    try {
      const response = await setDefaultAddress(addressId);
      if (response.success) {
        // 현재 목록에서 모든 주소의 is_default를 false로 설정
        const updatedAddresses = addressList.map(addr => ({
          ...addr,
          is_default: addr.address_id === addressId
        }));
        setAddressList(updatedAddresses);
      }
    } catch (error) {
      console.error('기본 배송지 설정 실패:', error);
    }
  };

  const handleSubmitAddress = async (addressData: UserAddressFormInfo) => {
    console.log('저장된 주소 데이터', addressData);
    if (!addressData.address_name || addressData.address_name === "0") {
      console.error("유효한 주소명을 입력하세요.");
      return;
    }

    const newAddress: UserAddressInfo = {
      address_name: addressData.address_name,
      recipient_name: addressData.recipient_name,
      recipient_phone: addressData.recipient_phone,
      address: addressData.address,
      detailed_address: addressData.detailed_address || '',
      is_default: addressData.is_default || false,
      postal_code: addressData.postal_code,
    };
    setAddressList((prev) => [...prev, newAddress])

    if (addressData.is_default) {
      // 새 주소가 기본 배송지로 설정되는 경우
      const updatedAddresses = addressList.map(addr => ({
        ...addr,
        is_default: false
      }));
      setAddressList(updatedAddresses);
    }

    try{
      console.log('[프론트 newAddress]', newAddress);
      const data = await fetchAddAddress(newAddress);
      console.log('[프론트 응답 데이터]', data);
      if (data && data.newAddress) {
        const addedAddress = newAddress;
        onNewAddress(data.newAddress);
        // setAddressList((prev) => [...prev, addedAddress]);
        setAddressList((prev) => [newAddress, ...prev]);
        setSelectedAddress(addedAddress);
        setAddModalOpen(false);
        console.log("addressList 데이터 값", addressList);
      } else {
        console.error("새 주소를 가져오는 데 실패했습니다.");
      }
    }catch(err){
      console.error('[프론트]주소 저장 실패',err);
    }
  };

  const handleUpdateAddress = async (addressData: UserAddressFormInfo) => {
    try {
      if (!selectedAddress?.address_id) {
        throw new Error("선택된 배송지가 없습니다.");
      }
      const response = await updateAddress(selectedAddress.address_id, addressData);
      if (response.success) {
        onUpdateAddress(response.address);
        setSelectedAddress(response.address);
        setUpdateModalOpen(false);
      }
    } catch (error) {
      console.error('배송지 수정 실패:', error);
      alert('배송지 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className={open ? "openModal modal" : "modal"}>
      {open ? (
        <section className="modalSection">
          <header className="modalHeader">
            {header}
            <button 
              onClick={close} 
              className="close"
              aria-label="모달 닫기"
            >
              <IoClose className="closeIcon"/>
            </button>
          </header>
          {/* <main className="modalMain">{children}</main> */}
          <div className="orderAddressBody">
            <form className="orderAddressFormBody">
              {userAddressDetails.map((address, index) => (
                <label className="orderDeliverySelectForm"  key={index}>
                  <div className="formContainer">
                    <div className="radioBox">
                      <input 
                        className='selectRadio' 
                        type="radio" 
                        name="radioOption" 
                        value={address.address_id}
                        checked={selectedAddress?.address_id === address.address_id}
                        onChange={() => handleAddressChange(address)}
                      />
                      <div className="defaultAddressContainer">
                        {address.is_default ? (
                          <>
                            <span>{address.address_name}</span>
                            <div className="defaultMarker">기본배송지</div>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className="selectDeliveryInfo">
                      <div className="deliveryName">{address.recipient_name}</div>
                      <div className="deliveryDetail">
                        {address.postal_code && <span>[{address.postal_code}] </span>}
                        {address.address}
                        {address.detailed_address ? ` ${address.detailed_address}` : ''}
                      </div>
                      <div className="deliveryPhone">{address.recipient_phone}</div>
                    </div>
                  </div>
                </label>
                ))}
            </form>
            <div className="changeDeliveryContainer">
              <div className="addDelivery">
                <FaPlus />
                <div className="addDeliveryTitle" onClick={openAddModal}>새 배송지 추가</div>
                {/* <OrderDeliveryAddModal open={addModalOpen} close={closeAddModal} header="새 배송지 추가">
                </OrderDeliveryAddModal> */}
                {addModalOpen && (
                  <AddressModal onClose={closeAddModal} onSubmit={handleSubmitAddress}/>
                )}
              </div>
              <div className="updateDelivery">
                <BsPencilSquare />
                <div className="updateDeliveryTitle" onClick={openUpdateModal}>선택 배송지 수정</div>
                {updateModalOpen && selectedAddress && (
                  <AddressModal 
                    onClose={closeUpdateModal}
                    onSubmit={handleUpdateAddress}
                    initialData={{
                      ...selectedAddress,
                      detailed_address: selectedAddress.detailed_address || '',
                      postal_code: selectedAddress.postal_code || ''
                    }}
                    isEditing={true}
                  />
                )}
              </div>
            </div>
          </div>
          <footer className="modalFooter">
            <button onClick={handleSelect} className="selectAddress">선택완료</button>
            <button onClick={close} className="footerClose">취소</button>
          </footer>
        </section>
      ):null}
    </div>
  );
}

export default OrderDeliveryModal;