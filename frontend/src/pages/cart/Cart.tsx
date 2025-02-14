import { useState, useEffect } from "react";
import "./Cart.css";
import Button from "../../shared/ui/button";
import ProductCard from "../../widgets/product-card/ProductCard";
import axiosInstance from "../../shared/axios/axios"; // Axios 인스턴스 가져오기
import Header from "../../widgets/header/Header";
import Footer from "../../widgets/footer/Footer";
import { useNavigate } from "react-router-dom";

type CartItem = {
  cartItemId: string;
  productId: string;
  name: string;
  price: number;
  final_price: number;
  quantity: number;
  selected_size: string;
  selected_color: string;
  main_image?: string;
  selected?: boolean; // 선택 여부 추가
};
const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // ✅ 임시 데이터 제거
  const [selectAll, setSelectAll] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // ✅ 체크박스 상태 관리

  const navigate = useNavigate(); // ✅ 페이지 이동을 위한 Hook

  useEffect(() => {
    const fetchCartItems = async () => {
        try {
        const userId = localStorage.getItem("userId") || "guest"; // 기본값 설정
        const response = await axiosInstance.get(`api/carts/${userId}`);

          const formattedItems = response.data.map((item: any) => ({
          cartItemId: item.cart_item_id, // ✅ 기본값 설정
          productId: item.product_id,
          name: item.name,
          price: item.final_price ?? 0, // ✅ NaN 방지
          quantity: item.quantity, // ✅ 기본값 설정
          SelectedSize: item.selected_size,
          SelectedColor: item.selected_color,
          image: item.main_image ?? "https://via.placeholder.com/100", // ✅ 기본 이미지 설정
          selected: false
        }));

        console.log("Cart Items API Response:", formattedItems);
        setCartItems(formattedItems);
      } catch (error) {
        console.error("장바구니 불러오기 실패:", error);
      }
    };

    fetchCartItems();
  }, []);

  // 상품 주문하기 클릭 시
  const handleOrder = async () => {
    if (!cartItems.length) {
      alert("장바구니가 비어 있습니다.");
      return;
    }

    const selectedItems = cartItems.filter((item) => item.selected);
    if (!selectedItems.length) {
      alert("주문할 상품을 선택해주세요.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      const orderData = {
        type: "Cart",
        userId,
        items: selectedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          totalAmount: item.price * item.quantity,
          shippingFee: 3000,
          selectedSize: item.selected_size,
          selectedColor: item.selected_color,
          statusId: "PENDING"
        }))
      };

      const response = await axiosInstance.post("/api/orders", orderData);
      alert(
        `주문이 성공적으로 완료되었습니다! 주문번호: ${response.data.orderId}`
      );
      navigate("/order", { state: { orderData } });
    } catch (error) {
      console.error("주문 실패:", error);
      alert("주문 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 수량 증가 함수 (로컬 상태 업데이트)
  const handleIncrease = async (cartItemId: string) => {
    try {
      const response = await axiosInstance.put(
        `/api/carts/${cartItemId}/increase`
      );
      setCartItems(response.data); // 백엔드 응답을 기반으로 상태 업데이트
    } catch (error) {
      console.error("수량 증가 API 호출 실패:", error);
    }
  };

  // 수량 감소 함수 (최소 수량 1 이상, 로컬 상태 업데이트)
  const handleDecrease = async (cartItemId: string) => {
    try {
      await axiosInstance.put(`/api/carts/${cartItemId}/decrease`);
    } catch (error) {
      console.error("수량 감소 API 호출 실패:", error);
    } finally {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
            : item
        )
      );
    }
  };

  // 개별 삭제 함수
  const handleRemove = async (cartItemId?: string) => {
    console.log(cartItemId);
    if (!cartItemId) {
      console.error("삭제할 cartItemId가 없습니다.", cartItemId);
      return;
    }

    console.log(`삭제 버튼 클릭됨. ID: ${cartItemId}`);

    try {
      await axiosInstance.delete(`/api/carts/${cartItemId}`);
      setCartItems((prev) =>
        prev.filter((item) => item.cartItemId !== cartItemId)
      );
    } catch (error) {
      console.error("상품 삭제 실패:", error);
    }
  };

  // 선택한 상품 삭제 함수
  const handleRemoveSelected = async () => {
        const selectedIds = cartItems
        .filter((item) => item.selected)
        .map((item) => item.cartItemId);

      console.log("삭제할 선택된 상품 ID들:", selectedIds);

      // 선택된 항목이 없으면 알림 후 종료
      if (selectedIds.length === 0) {
        alert("삭제할 항목을 먼저 선택하세요.");
        return;
      }

      try {
      // 선택된 각 아이템에 대해 삭제 API 호출 (여러 API 호출을 병렬로 처리)
      await axiosInstance.delete(`/api/carts/removeSelected`, {
        data: { cartItemIds: selectedIds } // ✅ DELETE 요청 시 body에 데이터 포함
      });

      // 로컬 상태 업데이트: 선택된 항목 제거
      setCartItems((prev) => prev.filter((item) => !item.selected));
    } catch (error) {
      console.error("선택한 상품 삭제 실패:", error);
    }
  };

  // 전체 선택 기능
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setCartItems((prev) =>
      prev.map((item) => ({
        ...item,
        selected: !selectAll
      }))
    );
  };

  // 개별 선택 기능
  const handleSelectItem = (cartItemId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  // 총 금액 계산
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // 약관동의 체크박스
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    console.log("Checkbox clicked!", event.target.checked);
  };

  return (
    <>
      <Header />
      <div className="cart-page">
        <h1>장바구니</h1>
        <div className="cart-container">
          {/* 상품 리스트 */}
          <div className="cart-items">
            {cartItems.length > 0 ? (
              <>
                <div className="select-all">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    전체 선택
                  </label>
                  <Button
                    text="선택 삭제"
                    onClick={handleRemoveSelected}
                    className="remove-selected"
                  />
                </div>
                {cartItems.map((item, index) => (
                  <div key={item.cartItemId || index} className="cart-item">
                    <input
                      type="checkbox"
                      checked={item.selected || false}
                      onChange={() => handleSelectItem(item.cartItemId)}
                    />
                    <img src={item.main_image} alt={item.name} />
                    <div className="cart-item-details">
                      <p className="item-name">{item.name}</p>
                      <p className="size">{item.selected_size}</p>
                      <p className="color">{item.selected_color}</p>
                      <p className="item-price">
                        {Math.round(item.price ?? 0).toLocaleString()}원
                      </p>
                    </div>
                    <div className="item-quantity">
                      <Button
                        text="-"
                        onClick={() => handleDecrease(item.cartItemId)}
                        className="quantity-button"
                      />
                      <input type="number" value={item.quantity} readOnly />
                      <Button
                        text="+"
                        onClick={() => handleIncrease(item.cartItemId)}
                        className="quantity-button"
                      />
                    </div>
                    <Button
                      text="삭제"
                      onClick={() => {
                        console.log("삭제 버튼 클릭됨. ID:", item.cartItemId);
                        handleRemove(item.cartItemId);
                      }}
                      className="remove-item"
                    />
                  </div>
                ))}
              </>
            ) : (
              <p className="empty-cart">장바구니가 비어 있습니다.</p>
            )}
          </div>

          {/* 요약 정보 */}
          <aside className="cart-summary">
            <p className="summary-row">
              <span>상품금액:</span>{" "}
              <span>{totalAmount.toLocaleString()}원</span>
            </p>
            <p className="summary-row">
              <span>배송비:</span> <span>3,000원</span>
            </p>
            <p className="summary-row total">
              <span>결제예정금액:</span>{" "}
              <span>{(totalAmount + 3000).toLocaleString()}원</span>
            </p>
            <label className="terms">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />{" "}
              주문 내용을 확인했으며 동의합니다.
            </label>
            <Button
              text="주문하기"
              onClick={() =>
                isChecked
                  ? handleOrder()
                  : alert("주문 내용을 확인하고 동의해야 합니다.")
              }
              className="order-button"
              disabled={!isChecked}
            />
          </aside>
        </div>

        {/* 추천 상품 */}
        <section className="recommended-products">
          <h2>추천 상품</h2>
          <div className="product-list">
            <ProductCard
              image="https://placeholderjs.com/100x100"
              title="자동 급수기"
              price="45,000원"
            />
            <ProductCard
              image="https://placeholderjs.com/100x100"
              title="높이조절 식기세트"
              price="38,000원"
            />
            <ProductCard
              image="https://placeholderjs.com/100x100"
              title="프리미엄 이동가방"
              price="126,000원"
            />
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
