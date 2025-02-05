import axiosInstance from "../shared/axios/axios";

export const fetchCartItems = async () => {
  try {
    const response = await axiosInstance.get("/api/cart");  // ✅ 올바른 경로인지 확인
    return response.data;
  } catch (error) {
    console.error("장바구니 불러오기 실패:", error);
    throw error;
  }
};
