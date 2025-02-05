import axios from "axios";

// 백엔드 API 기본 URL 설정
const API_URL = "http://localhost:3000/api/cart";

// 장바구니에 아이템 추가
export const addToCart = async (productId: number, quantity: number) => {
  try {
    const response = await axios.post(API_URL, { productId, quantity });
    return response.data;
  } catch (error) {
    console.error("장바구니 추가 실패:", error);
    throw error;
  }
};

// 장바구니 조회
export const getCart = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("장바구니 불러오기 실패:", error);
    throw error;
  }
};

// 장바구니 수량 증가
export const increaseQuantity = async (itemId: number) => {
  try {
    const response = await axios.put(`${API_URL}/${itemId}/increase`);
    return response.data;
  } catch (error) {
    console.error("수량 증가 실패:", error);
    throw error;
  }
};

// 장바구니 수량 감소
export const decreaseQuantity = async (itemId: number) => {
  try {
    const response = await axios.put(`${API_URL}/${itemId}/decrease`);
    return response.data;
  } catch (error) {
    console.error("수량 감소 실패:", error);
    throw error;
  }
};

// 장바구니 아이템 삭제
export const removeItem = async (itemId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${itemId}`);
    return response.data;
  } catch (error) {
    console.error("장바구니 아이템 삭제 실패:", error);
    throw error;
  }
};

// 선택한 아이템 삭제
export const removeSelectedItems = async (itemIds: number[]) => {
  try {
    const response = await axios.post(`${API_URL}/remove-selected`, {
      itemIds
    });
    return response.data;
  } catch (error) {
    console.error("선택한 아이템 삭제 실패:", error);
    throw error;
  }
};
