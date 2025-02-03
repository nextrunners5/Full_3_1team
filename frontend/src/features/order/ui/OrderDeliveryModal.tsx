// import { useEffect, useState } from "react";
import "./OrderDeliveryModal.css"
// import axiosInstance from "../../../shared/axios/axios";
import React from "react";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  open: boolean;
  close: () => void;
  header: string;
  children: React.ReactNode;
}


const OrderDeliveryModal: React.FC<ModalProps> = ({open, close, header, children}) => {
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
          <main className="modalMain">{children}</main>
          <footer className="modalFooter">
            <button onClick={close} className="selectAddress">선택완료</button>
            <button onClick={close} className="footerClose">취소</button>
          </footer>
        </section>
      ):null}
    </div>
  );
}

export default OrderDeliveryModal;