import axiosInstance from "./axios";

// QnA 질문 등록 API 호출 함수
export const postQuestion = async (data: {
  user_id: string;
  product_id: string;
  question_detail: string;
  question_date: string;
  question_private: string;
}) => {
  try {
    const response = await axiosInstance.post("/questions", data);
    return response.data;
  } catch (error) {
    console.error("QnA 등록 오류:", error);
    throw error;
  }
};