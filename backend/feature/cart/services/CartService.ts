import * as cartRepository from "../repo/CartRepo";

// ✅ 장바구니 조회
export const getCart = async (userId: string) => {
  if (!userId || userId === "null") {
    console.log("🚨 userId가 null! guest로 설정");
    userId = "guest"; // ✅ 기본값 설정
  }
  return await cartRepository.getCart(userId);
};

// ✅ 장바구니에 상품 추가 (상품이 존재하면 수량 증가)
export const addToCart = async (
  userId: string,
  shippingFee: number,
  productId: string,
  quantity: number
): Promise<number> => {
  // ✅ 1️⃣ 기존 장바구니 찾기 (cartId 조회)
  let cartId = await cartRepository.findCartId(userId);

  // ✅ 2️⃣ cartId가 없으면 새로 생성
  if (!cartId) {
    console.log("🚨 기존 장바구니 없음! 새로 생성 중...");
    cartId = await cartRepository.addToCart(userId, shippingFee);
    console.log("✅ 새 장바구니 생성됨. cartId:", cartId);
  }

  // ✅ 3️⃣ 기존 장바구니에 동일한 상품이 있는지 확인
  const existingCartItem = await cartRepository.findCartItem(cartId, productId);

  if (existingCartItem) {
    // ✅ 4️⃣ 동일한 상품이 있으면 수량 증가
    console.log("✅ 기존 상품 존재! 수량 증가 중...");
    await cartRepository.increaseQuantity(existingCartItem.cart_item_id, quantity);
    return existingCartItem.cart_item_id;
  }

  // ✅ 5️⃣ 동일한 상품이 없으면 새로 추가
  console.log("🛒 새 상품 추가! cartId:", cartId, "productId:", productId, "quantity:", quantity);
  await cartRepository.addToCartDetail(cartId, productId, quantity);

  return cartId;
};

// ✅ 상품 추가 (`CartDetail` 테이블) - 개별 추가
export const addToCartDetail = async (
  cartId: number,
  productId: string,
  quantity: number
) => {
  return await cartRepository.addToCartDetail(cartId, productId, quantity);
};

// ✅ 상품 수량 증가
export const increaseQuantity = async (
  cartItemId: number,
  quantity: number = 1
) => {
  return await cartRepository.increaseQuantity(cartItemId, quantity);
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
