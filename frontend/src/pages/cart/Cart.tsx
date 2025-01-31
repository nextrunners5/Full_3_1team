import React, { useState, useEffect } from "react";
import "./Cart.css";
import Button from "../../shared/ui/button";
import ProductCard from "../../widgets/product-card/ProductCard";
import axiosInstance from "../../shared/axios/axios"; // Axios 인스턴스 가져오기

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selected?: boolean; // 선택 여부 추가
};

const CartPage = () => {
  // 장바구니 상태
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectAll, setSelectAll] = useState(false); // 전체 선택 상태

  // 장바구니 데이터 불러오기
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axiosInstance.get("/cart"); // 백엔드 API 호출
        console.log("Cart Items API Response:", response.data);
        setCartItems(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("장바구니 불러오기 실패:", error);
        setCartItems([]);
      }
    };

    fetchCartItems();
  }, []);

  // 수량 증가 함수
  const handleIncrease = async (id: string) => {
    try {
      const response = await axiosInstance.put(`/cart/${id}/increase`);
      setCartItems(response.data); // 서버에서 업데이트된 데이터 반영
    } catch (error) {
      console.error("수량 증가 실패:", error);
    }
  };

  // 수량 감소 함수
  const handleDecrease = async (id: string) => {
    try {
      const response = await axiosInstance.put(`/cart/${id}/decrease`);
      setCartItems(response.data);
    } catch (error) {
      console.error("수량 감소 실패:", error);
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

  // 선택한 상품 삭제
  const handleRemoveSelected = async () => {
    try {
      const selectedIds = cartItems.filter((item) => item.selected).map((item) => item.id);
      await Promise.all(selectedIds.map((id) => axiosInstance.delete(`/cart/${id}`)));
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
        selected: !selectAll,
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
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <h1>장바구니</h1>
      <div className="cart-container">
        {/* 상품 리스트 */}
        <div className="cart-items">
          {cartItems.length > 0 ? (
            <>
              <div className="select-all">
                <label>
                  <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                  전체 선택
                </label>
                <Button text="선택 삭제" onClick={handleRemoveSelected} className="remove-selected" />
              </div>
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <input type="checkbox" checked={item.selected || false} onChange={() => handleSelectItem(item.id)} />
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-details">
                    <p className="item-name">{item.name}</p>
                    <p className="item-price">{item.price.toLocaleString()}원</p>
                  </div>
                  <div className="item-quantity">
                    <Button text="-" onClick={() => handleDecrease(item.id)} className="quantity-button" />
                    <input type="number" value={item.quantity} readOnly />
                    <Button text="+" onClick={() => handleIncrease(item.id)} className="quantity-button" />
                  </div>
                  <Button text="삭제" onClick={() => handleRemove(item.id)} className="remove-item" />
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
            <span>상품금액:</span> <span>{totalAmount.toLocaleString()}원</span>
          </p>
          <p className="summary-row">
            <span>배송비:</span> <span>3,000원</span>
          </p>
          <p className="summary-row total">
            <span>결제예정금액:</span> <span>{(totalAmount + 3000).toLocaleString()}원</span>
          </p>
          <label className="terms">
            <input type="checkbox" /> 주문 내용을 확인했으며 동의합니다.
          </label>
          <Button text="주문하기" onClick={() => alert("주문 완료")} className="order-button" />
        </aside>
      </div>

      {/* 추천 상품 */}
      <section className="recommended-products">
        <h2>추천 상품</h2>
        <div className="product-list">
          <ProductCard image="/images/bowl.png" title="자동 급수기" price="45,000원" />
          <ProductCard image="/images/kit.png" title="높이조절 식기세트" price="38,000원" />
          <ProductCard image="/images/bag.png" title="프리미엄 이동가방" price="126,000원" />
        </div>
      </section>
    </div>
  );
};

export default CartPage;
