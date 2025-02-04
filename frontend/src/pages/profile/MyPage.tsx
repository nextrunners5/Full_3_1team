import React, { useState } from "react";
import { AiFillSetting } from "react-icons/ai"; 
// ▼ 하트 아이콘 추가
import { FaHeart, FaRegHeart } from "react-icons/fa";

import './MyPage.css';
import Header from "../../widgets/header/Header"; 
import Footer from "../../widgets/footer/Footer";

// ⬇ 로컬 이미지 임포트 (경로와 파일명은 실제 프로젝트 구조에 맞게 변경)
import pc60 from '../../assets/pc60.jpg';
import pc200 from '../../assets/pc200.jpg';

const MyPage: React.FC = () => {
  // 드롭다운 필터 상태(기간, 주문상태)
  const [period, setPeriod] = useState("1month");
  const [orderType, setOrderType] = useState("all");

  // "다른 배송지 보기" 토글 상태
  const [showOtherAddresses, setShowOtherAddresses] = useState(false);

  // =============================
  //  (추가) 위시리스트 하트 토글 상태
  // =============================
  const [isLiked, setIsLiked] = useState(true);

  return (
    <div className="MP-my-page">
      <Header />
      <h1 className="MP-title">MY PAGE</h1>

      <div className="MP-content">
        {/* 왼쪽 섹션 */}
        <div>
          {/* 프로필 카드 */}
          <div className="MP-card MP-profile-card">
            <div className="MP-profile-info">
              {/* 프로필 이미지는 필요 시 pc60로 교체 가능 */}
              <img
                src="https://via.placeholder.com/80"
                alt="Profile"
                className="MP-profile-picture"
              />
              <div style={{ position: "relative" }}>
                <p className="MP-name">김민수님</p>
                <p className="MP-contact">
                  <span className="MP-label">연락처</span>
                  <span className="MP-contact-value">010-1234-5678</span>
                </p>
                
                <p className="MP-email">
                  <span className="MP-label">이메일</span>
                  <span className="MP-contact-value">minsu.kim@email.com</span>
                </p>

                <button className="MP-password-change-btn">비밀번호 변경</button>
              </div>
            </div>

            {/* (1) 톱니바퀴 아이콘: 프로필 카드의 우측 상단, 로그아웃 왼쪽 */}
            <button className="MP-settings-icon">
              <AiFillSetting size={25} color="#666" />
            </button>

            {/* (2) 로그아웃 버튼: 프로필 카드의 우측 상단 모서리 */}
            <button className="MP-logout-btn">로그아웃</button>
          </div>

          {/* 배송지 관리 카드 */}
          <div className="MP-card MP-address-management">
            <h3>배송지 관리</h3>
            <button className="MP-add-address-btn">새 배송지 추가</button>
            
            <div className="MP-address MP-default-address">
              <span className="MP-address-label">기본 배송지</span>
              <p>서울특별시 강남구 테헤란로 123</p>
              <p>삼성동 123-45 우편번호 06234</p>
              <div className="MP-address-actions">
                <button>수정</button>
                <button>삭제</button>
              </div>
            </div>

            {showOtherAddresses && (
              <div className="MP-other-address-list">
                <div className="MP-address MP-default-address">
                  <span className="MP-address-label">보조 배송지 1</span>
                  <p>인천광역시 남동구 어딘가 12</p>
                  <p>아파트 101동 202호</p>
                  <div className="MP-address-actions">
                    <button>수정</button>
                    <button>삭제</button>
                  </div>
                </div>

                <div className="MP-address MP-default-address">
                  <span className="MP-address-label">보조 배송지 2</span>
                  <p>부산광역시 해운대구 우동 123</p>
                  <div className="MP-address-actions">
                    <button>수정</button>
                    <button>삭제</button>
                  </div>
                </div>
              </div>
            )}

            {/* ▼ 버튼을 목록 아래로 이동 */}
            <button
              className="MP-view-other-addresses"
              onClick={() => setShowOtherAddresses(!showOtherAddresses)}
            >
              {showOtherAddresses ? "다른 배송지 닫기" : "다른 배송지 보기"}
            </button>
          </div>

          {/* 주문 내역 카드 */}
          <div className="MP-card MP-orders-section">
            <div className="MP-orders-header">
              <h3>주문 내역</h3>
              <div className="MP-order-filters">
                <select
                  className="MP-select"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option value="1month">최근 1개월</option>
                  <option value="3months">최근 3개월</option>
                  <option value="6months">최근 6개월</option>
                  <option value="12months">최근 1년</option>
                </select>

                <select
                  className="MP-select"
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  <option value="all">전체 주문</option>
                  <option value="delivered">배송완료</option>
                  <option value="preparing">배송준비중</option>
                  <option value="canceled">취소</option>
                </select>
              </div>
            </div>

            <table className="MP-order-table">
              <thead>
                <tr>
                  <th>주문일자</th>
                  <th>상품정보</th>
                  <th>주문금액</th>
                  <th>주문상태</th>
                  <th>취소</th>
                  <th>리뷰</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2024.02.15</td>
                  <td>
                    <div className="MP-order-product">
                      {/* ⬇ 60px 이미지를 pc60로 변경 */}
                      <img
                        src={pc60}
                        alt="Placeholder Product"
                        className="MP-product-image"
                      />
                      <div>
                        <p>프리미엄 강아지 사료 3kg</p>
                        <p>수량: 1개</p>
                      </div>
                    </div>
                  </td>
                  <td>45,000원</td>
                  <td className="MP-status MP-status-completed">배송완료</td>
                  <td>
                    <button className="MP-cancel-btn">주문취소</button>
                  </td>
                  <td>
                    <button className="MP-review-btn">리뷰작성</button>
                  </td>
                </tr>
                <tr>
                  <td>2024.02.15</td>
                  <td>
                    <div className="MP-order-product">
                      {/* ⬇ 동일하게 pc60 이미지 사용 */}
                      <img
                        src={pc60}
                        alt="Placeholder Product"
                        className="MP-product-image"
                      />
                      <div>
                        <p>프리미엄 강아지 사료 3kg</p>
                        <p>수량: 1개</p>
                      </div>
                    </div>
                  </td>
                  <td>45,000원</td>
                  <td className="MP-status MP-status-preparing">배송준비중</td>
                  <td>
                    <button className="MP-cancel-btn">주문취소</button>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 오른쪽 섹션 */}
        <div>
          <div className="MP-card MP-membership-status">
            <div className="MP-membership-header">
              <h3>멤버십 현황</h3>
              <button className="MP-membership-benefit-btn">멤버십 혜택</button>
            </div>

            <h2 className="MP-tier">SILVER</h2>
            <p className="MP-current-tier">현재 등급</p>

            <div className="MP-progress-info">
              <span>현재 구매액</span>
              <span>다음 등급까지</span>
            </div>
            <div className="MP-progress-bar">
              <div className="MP-progress" style={{ width: "38%" }}></div>
            </div>
            <div className="MP-progress-values">
              <span>₩75,000</span>
              <span>₩125,000</span>
            </div>
            <div className="MP-point-area">
              <p className="MP-point-label">포인트 적립금</p>
              <p className="MP-point-value">15,000 P</p>
            </div>
          </div>

          {/* 쿠폰 카드 */}
          <div className="MP-card MP-coupon-card">
            <h3>쿠폰</h3>
            <p>보유 현황: 15개</p>
            <button className="MP-coupon-check-btn">쿠폰 확인</button>
          </div>

          {/* 위시리스트 */}
          <div className="MP-card MP-wishlist">
            <h3>위시리스트</h3>
            <div className="MP-wishlist-content">
              <div className="MP-wishlist-item">
                <div className="MP-wishlist-image-container">
                  {/* ⬇ 200px 이미지를 pc200로 변경 */}
                  <img
                    src={pc200}
                    alt="Placeholder Wishlist Item"
                    className="MP-wishlist-image"
                  />
                  {/* ======================= */}
                  {/* 하트 아이콘 토글 버튼 */}
                  {/* ======================= */}
                  <button
                    className="MP-wishlist-heart-btn"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    {isLiked ? (
                      <FaHeart size={24} color="red" />
                    ) : (
                      <FaRegHeart size={24} color="red" />
                    )}
                  </button>
                </div>
                <p>프리미엄 강아지 사료 3kg</p>
              </div>
            </div>
            <button className="MP-wishlist-all-btn">전체보기</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyPage;
