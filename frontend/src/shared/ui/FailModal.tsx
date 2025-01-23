import React from 'react';
import "../../shared/style/FailModal.css";

interface LoginModalProps {
  error: string | null;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ error, onClose }) => {
  return (
    <div className="l_modal_overlay">
      <div className="l_modal">
        <div className="l_modal_header">
          <img src="src/assets/Fail.png" alt="로그인 실패 아이콘" className="l_modal_icon" />
        </div>
        <div className="l_modal_body">
          <h3 className="l_modal_title">로그인 실패</h3>
          <p className="l_modal_message">{error}</p>
        </div>
        <div className="l_modal_footer">
          <button onClick={onClose} className="l_modal_button">확인</button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
