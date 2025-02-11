import { FaTachometerAlt, FaBoxOpen, FaClipboardList, FaBullhorn, FaTicketAlt } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import './M-sidebar.css';

const MSidebar = () => {
  return (
    <div className="sidebar-M-s">
      <h1 className="logo-M-s">PETOPIA</h1>
      <nav>
        <ul>
          <li className="nav-item-M-s">
            <FaTachometerAlt className="icon-M-s" /> 대시보드
          </li>
          <li className="nav-item-M-s">
            <FaBoxOpen className="icon-M-s" /> 상품관리
          </li>
          <li className="nav-item-M-s">
            <FaClipboardList className="icon-M-s" /> 주문관리
          </li>
          <li className="nav-item-M-s">
            <FaBullhorn className="icon-M-s" /> 광고관리
          </li>
          <li className="nav-item-M-s">
            <FaTicketAlt className="icon-M-s" /> 쿠폰관리
          </li>
        </ul>
      </nav>
      <div className="logout-section-M-s">
        <button className="logout-button-M-s">
          <FiLogOut className="icon-M-s" /> 로그아웃
        </button>
      </div>
    </div>
  );
};

export default MSidebar;