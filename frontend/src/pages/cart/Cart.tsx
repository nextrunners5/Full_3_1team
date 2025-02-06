import { useState, useEffect } from "react";
import "./Cart.css";
import Button from "../../shared/ui/button";
import ProductCard from "../../widgets/product-card/ProductCard";
import axiosInstance from "../../shared/axios/axios"; // Axios 인스턴스 가져오기
import Footer from "../../widgets/footer/Footer";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selected?: boolean; // 선택 여부 추가
};

const CartPage = () => {
  // 임시 테스트 데이터를 초기 상태로 설정
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "테스트 상품 1",
      price: 10000,
      quantity: 1,
      image: "https://placeholderjs.com/80x80",
      selected: false
    },
    {
      id: "2",
      name: "테스트 상품 2",
      price: 20000,
      quantity: 2,
      image: "https://placeholderjs.com/80x80",
      selected: false
    }
  ]);
  const [selectAll, setSelectAll] = useState(false); // 전체 선택 상태

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axiosInstance.get("/cart"); // 백엔드 API 호출
        console.log("Cart Items API Response:", response.data);
        // API에서 배열 데이터를 받는다면 아래 코드가 동작합니다.
        setCartItems(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("장바구니 불러오기 실패:", error);
        // API 호출 실패 시 임시 데이터를 유지합니다.
      }
    };

    fetchCartItems();
  }, []);

  // 수량 증가 함수 (로컬 상태 업데이트)
  const handleIncrease = async (id: string) => {
    try {
      // 백엔드 API 호출 (변경된 데이터 반환이 없을 경우 아래 로직으로 대체)
      await axiosInstance.put(`/cart/${id}/increase`);
    } catch (error) {
      console.error("수량 증가 API 호출 실패:", error);
    } finally {
      // 백엔드에서 응답 데이터를 받아오지 않더라도 로컬에서 수량 증가
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    }
  };

  // 수량 감소 함수 (최소 수량 1 이상, 로컬 상태 업데이트)
  const handleDecrease = async (id: string) => {
    try {
      await axiosInstance.put(`/cart/${id}/decrease`);
    } catch (error) {
      console.error("수량 감소 API 호출 실패:", error);
    } finally {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
            : item
        )
      );
    }
  };

  // 개별 삭제 함수
  const handleRemove = async (id: string) => {
    try {
      await axiosInstance.delete(`/cart/${id}`);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("상품 삭제 실패:", error);
    }
  };

  // 선택한 상품 삭제 함수 (개선됨)
  const handleRemoveSelected = async () => {
    try {
      const selectedIds = cartItems
        .filter((item) => item.selected)
        .map((item) => item.id);

      console.log("삭제할 선택된 상품 ID들:", selectedIds);

      // 선택된 항목이 없으면 알림 후 종료
      if (selectedIds.length === 0) {
        alert("삭제할 항목을 먼저 선택하세요.");
        return;
      }

      // 선택된 각 아이템에 대해 삭제 API 호출 (여러 API 호출을 병렬로 처리)
      await Promise.all(
        selectedIds.map((id) => axiosInstance.delete(`/cart/${id}`))
      );

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
  const handleSelectItem = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // 총 금액 계산
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <input
                      type="checkbox"
                      checked={item.selected || false}
                      onChange={() => handleSelectItem(item.id)}
                    />
                    <img src={item.image} alt={item.name} />
                    <div className="cart-item-details">
                      <p className="item-name">{item.name}</p>
                      <p className="item-price">
                        {item.price.toLocaleString()}원
                      </p>
                    </div>
                    <div className="item-quantity">
                      <Button
                        text="-"
                        onClick={() => handleDecrease(item.id)}
                        className="quantity-button"
                      />
                      <input type="number" value={item.quantity} readOnly />
                      <Button
                        text="+"
                        onClick={() => handleIncrease(item.id)}
                        className="quantity-button"
                      />
                    </div>
                    <Button
                      text="삭제"
                      onClick={() => handleRemove(item.id)}
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
              <input type="checkbox" /> 주문 내용을 확인했으며 동의합니다.
            </label>
            <Button
              text="주문하기"
              onClick={() => alert("주문 완료")}
              className="order-button"
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
