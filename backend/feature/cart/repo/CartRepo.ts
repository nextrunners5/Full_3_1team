import pool from "../../../config/dbConfig";

// ✅ 장바구니 조회 (`Cart` 테이블의 `user_id` 기반)
export const getCart = async (userId: string) => {
    const query = `
    SELECT 
    cd.cart_item_id, 
    cd.cart_id, 
    cd.product_id, 
    cd.quantity, 
    p.product_name AS name, 
    p.final_price AS price, 
    'https://via.placeholder.com/100' AS image  -- NoSQL 저장 전 임시 이미지 적용
    FROM CartDetail cd
    JOIN Products p ON cd.product_id = p.product_id
    JOIN Cart c ON cd.cart_id = c.cart_id
    WHERE c.user_id = 'guest';`

  console.log("🛠 실행할 SQL 쿼리:", query, " with userId:", userId);

  try {
    const [rows]: any = await pool.promise().query(query, [userId]);
    console.log("🛒 장바구니 데이터 조회:", rows); // ✅ 콘솔 로그 추가
    return rows;
  } catch (error) {
    console.error("🚨 장바구니 조회 실패:", error);
    throw error;
  }
};

// ✅ 장바구니 생성 (`Cart` 테이블에 `cart_id` 생성 후 반환)
export const addToCart = async (
  userId: string,
  shippingFee: number
): Promise<number> => {
  const query = `INSERT INTO Cart (user_id, shipping_fee) VALUES (?, ?)`;
  const [result]: any = await pool.promise().query(query, [userId, shippingFee]); // ✅ 반환 타입 명확화

  return result.insertId; // ✅ 삽입된 `cart_id` 반환
};

// ✅ 상품 추가 (`CartDetail` 테이블에 `cart_id` & `product_id` 추가)
export const addToCartDetail = async (
  cartId: number,
  productId: string,
  quantity: number
) => {
  const checkCartQuery = `SELECT cart_id FROM Cart WHERE cart_id = ?`;
  const [cartRows]: any = await pool.promise().query(checkCartQuery, [cartId]);

  if (cartRows.length === 0) {
    console.error("🚨 장바구니가 존재하지 않습니다. cartId:", cartId);
    throw new Error("장바구니가 존재하지 않습니다.");
  }

  const query = `
    INSERT INTO CartDetail (cart_id, product_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + ?`;

  await pool.promise().query(query, [cartId, productId, quantity, quantity]);
  console.log("상품 추가 완료", { cartId, productId, quantity });
};

// ✅ 상품 수량 증가 (`CartDetail` 테이블의 `cart_item_id` 사용)
export const increaseQuantity = async (cartItemId: number) => {
  const query =
    "UPDATE CartDetail SET quantity = quantity + 1 WHERE cart_item_id = ?";
  await pool.promise().query(query, [cartItemId]);
};

// ✅ 상품 수량 감소 (`CartDetail` 테이블의 `cart_item_id` 사용)
export const decreaseQuantity = async (cartItemId: number) => {
  const query =
    "UPDATE CartDetail SET quantity = quantity - 1 WHERE cart_item_id = ? AND quantity > 1";
  await pool.promise().query(query, [cartItemId]);
};

// ✅ 개별 상품 삭제 (`CartDetail` 테이블의 `cart_item_id` 사용)
export const removeItem = async (cartItemId: number) => {
  const query = "DELETE FROM CartDetail WHERE cart_item_id = ?";
  await pool.promise().query(query, [cartItemId]);
};

// ✅ 선택된 상품 삭제 (`CartDetail` 테이블의 `cart_item_id` 배열 사용)
export const removeSelectedItems = async (cartItemIds: number[]) => {
  if (cartItemIds.length === 0) return;
  const query = `DELETE FROM CartDetail WHERE cart_item_id IN (${cartItemIds
    .map(() => "?")
    .join(",")})`;
  await pool.promise().query(query, cartItemIds);
};
