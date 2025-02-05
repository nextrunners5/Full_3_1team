import * as cartRepository from "../repo/CartRepo";

// 장바구니 조회 서비스
export const getCart = async () => {
    return await cartRepository.getCart();
  };
  
  // 장바구니에 상품 추가 서비스
  export const addToCart = async (userId: number, productId: number, quantity: number) => {
    return await cartRepository.addToCart(userId, productId, quantity);
  };
  
  // 상품 수량 증가 서비스
  export const increaseQuantity = async (id: number) => {
    return await cartRepository.increaseQuantity(id);
  };
  
  // 상품 수량 감소 서비스
  export const decreaseQuantity = async (id: number) => {
    return await cartRepository.decreaseQuantity(id);
  };
  
  // 개별 상품 삭제 서비스
  export const removeItem = async (id: number) => {
    return await cartRepository.removeItem(id);
  };
  
  // 선택된 상품 삭제 서비스
  export const removeSelectedItems = async (ids: number[]) => {
    return await cartRepository.removeSelectedItems(ids);
  };