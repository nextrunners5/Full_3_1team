import * as cartRepository from "../repo/CartRepo";

// ✅ 장바구니 조회
export const getCart = async (userId: string) => {
  return await cartRepository.getCart(userId);
};

// ✅ 장바구니 생성 (`Cart` 테이블)
export const addToCart = async (userId: string, shippingFee: number): Promise<number> => {
  return await cartRepository.addToCart(userId, shippingFee);
};

// ✅ 상품 추가 (`CartDetail` 테이블)
export const addToCartDetail = async (cartId: number, productId: string, quantity: number) => {
  return await cartRepository.addToCartDetail(cartId, productId, quantity);
};

// ✅ 상품 수량 증가
export const increaseQuantity = async (cartItemId: number) => {
  return await cartRepository.increaseQuantity(cartItemId);
};

// ✅ 상품 수량 감소
export const decreaseQuantity = async (cartItemId: number) => {
  return await cartRepository.decreaseQuantity(cartItemId);
};

// ✅ 상품 삭제
export const removeItem = async (cartItemId: number) => {
  return await cartRepository.removeItem(cartItemId);
};

// ✅ 선택된 상품 삭제
export const removeSelectedItems = async (cartItemIds: number[]) => {
  return await cartRepository.removeSelectedItems(cartItemIds);
};
