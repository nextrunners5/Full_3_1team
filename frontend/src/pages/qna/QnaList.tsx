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
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const formatDateToKST = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 9);
    return date.toISOString().slice(0, 16).replace("T", " ");
  };

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId"); // 로그인된 사용자 ID 저장
    setIsAdmin(userRole === "admin");
    setCurrentUser(userId);
  }, []);

  useEffect(() => {
    if (!productId) return;

    const getQnA = async () => {
      const data = await fetchQnAList(productId);
      setQnaList(data);
    };

    getQnA();
  }, [productId]);


  if (!productId) {
    console.error("QnaList: productId가 제공되지 않았습니다.");
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

              {qna.question_private === "Y" && !(isAdmin || qna.user_id === currentUser) ? (
                <>
                  <p className="private-tag">
                    관리자 및 작성자만 볼 수 있는 게시글입니다.
                  </p>
                </>
              ) : (
                <>
                  <h3>{qna.question_detail}</h3>
                  <p className="qna-user">
                    작성자: {qna.user_id} | {formatDateToKST(qna.question_date)}
                  </p>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default QnaList;
