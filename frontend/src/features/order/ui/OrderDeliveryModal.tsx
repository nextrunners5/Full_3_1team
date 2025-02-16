import "./OrderDeliveryModal.css"
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { UserAddressFormInfo, UserAddressInfo } from "../model/OrderModel";
// import OrderDeliveryAddModal from "./OrderDeliveryAddModal";
// import OrderDeliveryUpdateModal from "./OrderDeliveryUpdateModal";
import { FaPlus } from "react-icons/fa6";
import { BsPencilSquare } from "react-icons/bs";
import AddressModal from "../../address/ui/AddressModal";
import { fetchAddAddress } from "../api/Order";

interface ModalProps {
  open: boolean;
  close: () => void;
  header: string;
  userAddressDetails: UserAddressInfo[];
  onSelect: (address:UserAddressInfo) => void;
  onNewAddress: (address: UserAddressInfo) => void;
}

const OrderDeliveryModal: React.FC<ModalProps> = ({open, close, header, userAddressDetails, onSelect, onNewAddress}) => {
  const [selectedAddress, setSelectedAddress] = useState<UserAddressInfo | null>(null);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if(open){
      console.log("모달", userAddressDetails);
      // console.log("address_id", selectedAddress?.address_id);
      // setAddressList(userAddressDetails);
      const defaultAddress = userAddressDetails.find((addr) => addr.is_default === true);
      if(defaultAddress) {
        setSelectedAddress(defaultAddress);
        console.log('선택된 주소', defaultAddress);
      }
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
  const openUpdateModal = () => {setUpdateModalOpen(true); };
  // const closeUpdateModal = () => {setUpdateModalOpen(false); };

  const [addressList, setAddressList] = useState<UserAddressInfo[]>(userAddressDetails);
  const handleSubmitAddress = async (addressData: UserAddressFormInfo) => {
    console.log('저장된 주소 데이터', addressData);

    const newAddress: UserAddressInfo = {
      // address_id: Date.now(),  // 고유 ID 생성
      address_name: addressData.address_name,
      recipient_name: addressData.recipient_name,
      recipient_phone: addressData.recipient_phone,
      address: addressData.address,
      detailed_address: addressData.detailed_address,
      is_default: addressData.is_default,
      postal_code: addressData.postal_code,
    };
    setAddressList((prev) => [...prev, newAddress])

    try{
      console.log('[프론트 newAddress]', newAddress);
      const data = await fetchAddAddress(newAddress);
      if (data && data.newAddress) {
        onNewAddress(data.newaddress);
        setAddressList((prev) => [...prev, data.newAddress]);
        setSelectedAddress(data.newAddress);
        setAddModalOpen(false);
        console.log("addressList 데이터 값", addressList);
      } else {
        console.error("새 주소를 가져오는 데 실패했습니다.");
      }
    }catch(err){
      console.error('[프론트]주소 저장 실패',err);
    }

  }


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
                        <span>{address.address_name}</span>
                        {address.is_default  && <div className="defaultMarker">기본배송지</div>}
                      </div>
                    </div>
                    <div className="selectDeliveryInfo">
                      <div className="deliveryName">{address.recipient_name}</div>
                      <div className="deliveryDetail">{address.address}{address.detailed_address}</div>
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
                {/* <OrderDeliveryUpdateModal open={updateModalOpen} close={closeUpdateModal} header="배송지 수정">
                </OrderDeliveryUpdateModal> */}
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