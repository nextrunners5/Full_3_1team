import React from 'react';
import { FiLogOut } from 'react-icons/fi';
import './M-header.css';

const MHeader = () => {
  return (
    <header className="header-M-h">
      <h2 className="title-M-h">관리자 대시보드</h2>
      <div className="user-info-M-h">
        <span className="username-M-h">관리자님</span>
        <button className="logout-button-M-h">
          <FiLogOut className="icon-M-h" /> 로그아웃
        </button>
      </div>
    </header>
  );
};

export default MHeader;
