import axios from "axios";

// 백엔드 API 기본 URL 설정
const API_URL = "http://localhost:3000/api/carts";

// 장바구니에 아이템 추가
export const addToCart = async (userId: string, productId: number, quantity: number) => {
  try {
    const response = await axios.post(API_URL, { userId, productId, quantity });
    return response.data;
  } catch (error) {
    console.error("장바구니 추가 실패:", error);
    throw error;
  }
};

// 장바구니 조회
export const getCart = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("장바구니 불러오기 실패:", error);
    throw error;
  }
};

// 장바구니 수량 증가
export const increaseQuantity = async (cartItemId: number) => {
  try {
    const response = await axios.put(`${API_URL}/${cartItemId}/increase`);
    return response.data;
  } catch (error) {
    console.error("수량 증가 실패:", error);
    throw error;
  }
};

// 장바구니 수량 감소
export const decreaseQuantity = async (cartItemId: number) => {
  try {
    const response = await axios.put(`${API_URL}/${cartItemId}/decrease`);
    return response.data;
  } catch (error) {
    console.error("수량 감소 실패:", error);
    throw error;
  }
};

// 장바구니 아이템 삭제
export const removeItem = async (cartItemId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${cartItemId}`);
    return response.data;
  } catch (error) {
    console.error("장바구니 아이템 삭제 실패:", error);
    throw error;
  }
};

// 선택한 아이템 삭제
export const removeSelectedItems = async (cartItemIds: number[]) => {
  try {
    const response = await axios.post(`${API_URL}/remove-selected`, {
      data: { cartItemIds },
    });
    return response.data;
  } catch (error) {
    console.error("선택한 아이템 삭제 실패:", error);
    throw error;
  }
};
