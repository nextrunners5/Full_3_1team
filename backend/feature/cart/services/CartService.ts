import * as cartRepository from "../repo/CartRepo";
import ProductImage from "../../product/img/ProductImage";

// ✅ 장바구니 조회
export const getCart = async (userId: string) => {
  const cartItems = await cartRepository.getCart(userId);

  for (let item of cartItems) {
    try {
      // ✅ productId가 없을 경우 product_id 사용 (일관성 유지)
      const productId = String(item.productId || item.product_id);

      // ✅ MongoDB에서 이미지 찾기
      const mongoProduct = await ProductImage.findOne({ product_id: productId });

      // ✅ MongoDB에서 이미지가 있으면 추가, 없으면 기본 이미지 설정
      item.image = mongoProduct?.main_image ?? "https://via.placeholder.com/100";
    } catch (error) {
      console.error(`🚨 MongoDB 이미지 조회 실패 (product_id: ${item.productId}):`, error);
      item.image = "https://via.placeholder.com/100"; // 기본 이미지 설정
    }
  }

  return cartItems;
};

// ✅ 장바구니에 상품 추가 (상품이 존재하면 수량 증가)
export const addToCart = async (
  userId: string,
  shippingFee: number,
  productId: string,
  quantity: number,
  selectedSize: string,
  selectedColor: string
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
  console.log("🔎 findCartItem 실행:", { cartId, productId });
  const existingCartItem = await cartRepository.findCartItem(cartId, productId);
  console.log("📌 findCartItem 결과:", existingCartItem);

  if (existingCartItem) {
    // ✅ 4️⃣ 동일한 상품이 있으면 수량 증가
    console.log("✅ 기존 상품 존재! 수량 증가 중...");
    await cartRepository.increaseQuantity(existingCartItem.cart_item_id, quantity);
    return existingCartItem.cart_item_id;
  }

  // ✅ 5️⃣ 동일한 상품이 없으면 새로 추가
  console.log("🛒 새 상품 추가! cartId:", cartId, "productId:", productId, "quantity:", quantity, "size:", selectedSize, "color:", selectedColor);
  
  await cartRepository.addToCartDetail(cartId, productId, quantity, selectedSize, selectedColor);
  return cartId;
};

// ✅ 상품 추가 (`CartDetail` 테이블) - 개별 추가
export const addToCartDetail = async (
  cartId: number,
  productId: string,
  quantity: number,
  selectedSize: string,
  selectedColor: string
) => {
  return await cartRepository.addToCartDetail(cartId, productId, quantity, selectedSize, selectedColor);
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
