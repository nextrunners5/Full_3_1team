import React, { useState } from "react";
import "../qna/CSS/QnaModal.css";

interface QnaModalProps {
  onClose: () => void;
}

const QnaModal: React.FC<QnaModalProps> = ({ onClose }) => {
  const [inquiryType, setInquiryType] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = () => {
    console.log({
      inquiryType,
      title,
      content,
      isPrivate,
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="title-name">
        <h2>상품 문의하기</h2>
        <button className="close-button" onClick={onClose}>✖</button>
        </div>
        <label>문의 유형</label>
        <select value={inquiryType} onChange={(e) => setInquiryType(e.target.value)}>
          <option value="">문의 유형을 선택해주세요</option>
          <option value="상품 문의">상품 문의</option>
          <option value="배송 문의">배송 문의</option>
        </select>
        
        <label>제목</label>
        <input className="qna-input" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력해주세요" />

        <label>문의 내용</label>
        <textarea className="qna-textarea" value={content} onChange={(e) => setContent(e.target.value)} placeholder="문의하실 내용을 입력해주세요" />

        <div className="checkbox-group">
          <input type="checkbox" checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} />
          <label className="checkbox-title">관리자에게만 보여주기</label>
        </div>

        <div className="modal-buttons">
          <button className="cancel-button" onClick={onClose}>취소</button>
          <button className="submit-button" onClick={handleSubmit}>등록하기</button>
        </div>
      </div>
    </div>
  );
};

export default QnaModal;
