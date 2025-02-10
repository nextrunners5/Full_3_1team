import { useState, useEffect } from "react";
import "./Cart.css";
import Button from "../../shared/ui/button";
import ProductCard from "../../widgets/product-card/ProductCard";
import axiosInstance from "../../shared/axios/axios"; // Axios 인스턴스 가져오기
import Footer from "../../widgets/footer/Footer";
import { useNavigate } from "react-router-dom"; 

type CartItem = {
  cartItemId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image?: string;
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
        const userId = localStorage.getItem("userId") || "guest"; // 또는 사용자 ID를 가져오는 로직 (ex: localStorage.getItem("userId"))
        const response = await axiosInstance.get(`api/carts/${userId}`);

        const formattedItems = response.data.map((item: any) => ({
          cartItemId: item.cart_item_id, // ✅ 키 변경
          productId: item.product_id,
          name: item.product_name,
          price: item.final_price,
          quantity: item.quantity,
          size: item.sizes,
          color: item.colors,
          image: item.image || "https://via.placeholder.com/100", // ✅ 임시 이미지 처리
          selected: false, 
        }));

        console.log("Cart Items API Response:", formattedItems);
        setCartItems(formattedItems);
      } catch (error) {
        console.error("장바구니 불러오기 실패:", error);
      }
    };

    fetchCartItems();
  }, []);

  // 수량 증가 함수 (로컬 상태 업데이트)
  const handleIncrease = async (cartItemId: string) => {
    try {
      // 백엔드 API 호출 (변경된 데이터 반환이 없을 경우 아래 로직으로 대체)
      await axiosInstance.put(`/api/carts/${cartItemId}/increase`);
    } catch (error) {
      console.error("수량 증가 API 호출 실패:", error);
    } finally {
      // 백엔드에서 응답 데이터를 받아오지 않더라도 로컬에서 수량 증가
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
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
    try {
      const selectedIds = cartItems
        .filter((item) => item.selected)
        .map((item) => item.cartItemId);

      console.log("삭제할 선택된 상품 ID들:", selectedIds);

      // 선택된 항목이 없으면 알림 후 종료
      if (selectedIds.length === 0) {
        alert("삭제할 항목을 먼저 선택하세요.");
        return;
      }

      // 선택된 각 아이템에 대해 삭제 API 호출 (여러 API 호출을 병렬로 처리)
      await axiosInstance.post(`/api/carts/remove-selected`, {
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

  // 주문하기 버튼 클릭 시 실행되는 함수
  const handleOrderClick = () => {
    if (isChecked) {
      navigate("/api/orders"); // ✅ 주문 페이지로 이동
    } else {
      alert("주문 내용을 확인하고 동의해야 합니다.");
    }
  };

   return (
    <>
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
                    <img src={item.image} alt={item.name} />
                    <div className="cart-item-details">
                      <p className="item-name">{item.name}</p>
                      <p className="size">{item.sizes}</p>
                      <p className="color">{item.colors}</p>
                      <p className="item-price">
                        {(item.final_price ?? 0).toLocaleString()}원
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
              <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} /> 주문 내용을 확인했으며 동의합니다.
            </label>
            <Button text="주문하기" onClick={(handleOrderClick) => {
              if (isChecked) {
                alert("주문 완료");
              } else {
                alert("주문 내용을 확인하고 동의해야 합니다.");
              }
            }} className="order-button" disabled={!isChecked} />
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
