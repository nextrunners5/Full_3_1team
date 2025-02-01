import React, { useEffect, useState } from "react";
import { fetchQnAList } from "../../shared/axios/QnAAxios";
import "./CSS/QnaList.css";

interface QnaListProps {
  productId: string;
  question_id: number;
  user_id: string;
  question_detail: string;
  question_date: string;
  question_private: string;
}

const QnaList: React.FC<{ productId: string }> = ({ productId }) => {
  const [qnaList, setQnaList] = useState<QnaListProps[]>([]);
  const formatDateToKST = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 9); // ✅ UTC → KST 변환
    return date.toISOString().slice(0, 16).replace("T", " ");
  };


  useEffect(() => {
    const getQnA = async () => {
      const data = await fetchQnAList(productId);
      setQnaList(data);
    };
    getQnA();
  }, [productId]);

  if (!productId) {
    console.error(" QnaList: productId가 제공되지 않았습니다.");
    return null;
  }

  return (
    <div className="qna-container">
      {qnaList.length === 0 ? (
        <p className="empty-message">등록된 질문이 없습니다.</p>
      ) : (
        qnaList.map((qna) => (
          <div key={qna.question_id} className="qna-item">
            <div className="question">
              <span className="qna-tag">질문</span>
              <h3>{qna.question_detail}</h3>
              <p className="qna-user">작성자: {qna.user_id} | {formatDateToKST(qna.question_date)}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default QnaList;
