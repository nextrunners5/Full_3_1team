import React, { useState, useEffect } from "react";
import { AiFillSetting } from "react-icons/ai";
import {
  FaHeart,
  FaRegHeart,
  FaChevronDown,
  FaChevronUp,
  FaTrash,
  FaStar,
  FaEdit,
} from "react-icons/fa";
import "./MyPage.css";
import Header from "../../widgets/header/Header";
import Footer from "../../widgets/footer/Footer";
import pc60 from "../../assets/pc60.jpg";
import pc200 from "../../assets/pc200.jpg";
import AddressSearch from "../../shared/ui/AddressSearch";
import {
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../features/address/api/Address";
import type { Address } from "../../features/address/model/Address";
import AddressModal from "../../features/address/ui/AddressModal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../shared/axios/axios";
import MyPageWishlist from "../wishlist/MyPageWish";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  signup_type: "local" | "kakao";
}

interface AddressFormData {
  recipient_name: string;
  recipient_phone: string;
  address: string;
  detailed_address: string;
  postal_code: string;
  address_name: string;
  is_default: boolean;
}

interface OrderHistoryItem {
  order_id: string;
  order_date: string;
  total_amount: number;
  status_id: string;
  status_name: string;
  product_name: string;
}

const MyPage: React.FC = () => {
  const [period, setPeriod] = useState("1month");
  const [orderType, setOrderType] = useState("all");

  const [showOtherAddresses, setShowOtherAddresses] = useState(false);
  const [isLiked, setIsLiked] = useState(true);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState({
    recipient_name: "",
    recipient_phone: "",
    detailed_address: "",
    address_name: "",
    is_default: false,
  });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  const [isOrderLoading, setIsOrderLoading] = useState(true);

  const navigate = useNavigate();

  // 컴포넌트 마운트 시 로그인 상태 체크
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      navigate("/login", {
        // 로그인 후 다시 마이페이지로 돌아올 수 있도록 state에 리다이렉트 경로 저장
        state: { from: "/MyPage" },
      });
    }
  }, [navigate]);

  // 배송지 목록 조회
  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get("/api/addresses");
      console.log("서버 응답 원본:", response.data.addresses);

      if (response.data.success) {
        const mappedAddresses = response.data.addresses.map((addr: any) => {
          console.log("매핑 전 주소 데이터:", addr);
          const mappedAddr = {
            ...addr,
            detailed_address: addr.detailed_address || "",
          };
          console.log("매핑 후 주소 데이터:", mappedAddr);
          return mappedAddr;
        });

        console.log("최종 매핑된 주소 목록:", mappedAddresses);
        setAddresses(mappedAddresses);
      }
    } catch (error) {
      console.error("배송지 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // 사용자 정보 조회
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/users/profile");
        console.log("프로필 조회 응답:", response.data);

        if (response.data.success) {
          setUserProfile(response.data.user);
        } else {
          console.error("프로필 조회 실패:", response.data.message);
        }
      } catch (error) {
        console.error("프로필 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // 주소 검색 완료 핸들러
  const handleAddressComplete = async (data: {
    address: string;
    zonecode: string;
  }) => {
    try {
      const addressData = {
        ...newAddress,
        address: data.address,
        postal_code: data.zonecode,
      };

      const response = await addAddress(addressData);
      setAddresses([...addresses, response]);
      setShowAddressSearch(false);
      setNewAddress({
        recipient_name: "",
        recipient_phone: "",
        detailed_address: "",
        address_name: "",
        is_default: false,
      });
    } catch (error) {
      console.error("배송지 추가 실패:", error);
    }
  };

  // 배송지 추가 핸들러
  const handleAddAddress = async (addressData: AddressFormData) => {
    try {
      if (editAddress) {
        // 수정 모드
        const response = await axiosInstance.put(
          `/api/addresses/${editAddress.address_id}`,
          addressData
        );
        if (response.data.success) {
          fetchAddresses(); // 배송지 목록 새로고침
          setShowAddressModal(false);
          setEditAddress(null);
        }
      } else {
        // 새로운 주소 추가 모드
        const response = await axiosInstance.post(
          "/api/addresses",
          addressData
        );
        if (response.data.success) {
          fetchAddresses(); // 배송지 목록 새로고침
          setShowAddressModal(false);
        }
      }
    } catch (error) {
      console.error("배송지 저장 실패:", error);
      // 에러 처리 로직 추가
    }
  };

  // 배송지 삭제 핸들러
  const handleDeleteAddress = async (addressId: string | number) => {
    console.log("삭제 시도할 배송지 ID:", addressId);

    if (!addressId) {
      console.error("주소 ID가 없습니다");
      return;
    }

    try {
      const response = await axiosInstance.delete(
        `/api/addresses/${addressId}`
      );
      console.log("삭제 응답:", response.data);

      if (response.data.success) {
        fetchAddresses();
      }
    } catch (error) {
      console.error("배송지 삭제 실패:", error);
    }
  };

  // 기본 배송지 설정 핸들러
  const handleSetDefaultAddress = async (addressId: string | number) => {
    if (!addressId) {
      console.error("주소 ID가 없습니다");
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/api/addresses/${addressId}/default`
      );

      if (response.data.success) {
        // 성공적으로 설정된 경우에만 목록 새로고침
        fetchAddresses();
      }
    } catch (error) {
      console.error("기본 배송지 설정 실패:", error);
    }
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // 기본 배송지와 나머지 배송지 분리
  const defaultAddress = addresses.find((addr) => addr.is_default);
  const otherAddresses = addresses.filter((addr) => !addr.is_default);

  const handleSettingsClick = () => {
    // 프로필 설정 페이지로 이동
    navigate("/profile/settings");
  };

  // 배송지 수정 핸들러
  const handleEditAddress = (address: Address) => {
    setEditAddress(address);
    setShowAddressModal(true);
  };

  // 주문내역 조회
  const fetchOrderHistory = async () => {
    try {
      setIsOrderLoading(true);
      const response = await axiosInstance.get('/api/orders/history', {
        params: { period }
      });

      if (response.data.success) {
        const filteredOrders = response.data.orders.filter((order: OrderHistoryItem) => {
          if (orderType === 'processing') {
            return ['OS001', 'OS002', 'OS003'].includes(order.status_id);
          } else if (orderType === 'completed') {
            return ['OS004', 'OS005', 'OS006'].includes(order.status_id);
          }
          return true;
        });
        
        setOrderHistory(filteredOrders);
      }
    } catch (error) {
      console.error('주문내역 조회 실패:', error);
    } finally {
      setIsOrderLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, [period, orderType]);

  // 주문내역 렌더링
  const renderOrderHistory = () => {
    if (isOrderLoading) {
      return (
        <tr>
          <td colSpan={5}>주문내역을 불러오는 중...</td>
        </tr>
      );
    }

    if (!orderHistory.length) {
      return (
        <tr>
          <td colSpan={5}>주문내역이 없습니다.</td>
        </tr>
      );
    }

    return orderHistory.map((order: OrderHistoryItem) => (
      <tr key={order.order_id}>
        <td>{new Date(order.order_date).toLocaleDateString()}</td>
        <td>
          <div className="MP-order-product">
            <div>
              <p>{order.product_name}</p>
            </div>
          </div>
        </td>
        <td>{Number(order.total_amount).toLocaleString('ko-KR')}원</td>
        <td className={`MP-status MP-status-${order.status_id.toLowerCase()}`}>
          {order.status_name}
        </td>
        <td>
          {order.status_id === "OS001" && (
            <button 
              className="MP-cancel-btn"
              onClick={() => handleCancelOrder(order.order_id)}
            >
              주문취소
            </button>
          )}
        </td>
      </tr>
    ));
  };

  // 주문 취소 핸들러
  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await axiosInstance.post(
        `/api/orders/${orderId}/cancel`
      );
      if (response.data.success) {
        fetchOrderHistory(); // 주문내역 새로고침
      }
    } catch (error) {
      console.error("주문 취소 실패:", error);
    }
  };

  return (
    <div className="MP-my-page">
      <Header />
      <h1 className="MP-title">MY PAGE</h1>
      <div className="MP-content">
        <div>
          {/* 프로필 카드 */}
          <div className="MP-card MP-profile-card">
            <button
              className="MP-settings-icon"
              aria-label="프로필 설정"
              onClick={handleSettingsClick}
            >
              <AiFillSetting />
            </button>
            <div className="MP-profile-info">
              <img
                src="https://via.placeholder.com/80"
                alt="Profile"
                className="MP-profile-picture"
              />
              <div>
                <p className="MP-name">{userProfile?.name || "사용자"}님</p>
                <p className="MP-contact">
                  <span className="MP-label">연락처</span>
                  <span className="MP-contact-value">
                    {userProfile?.phone || "-"}
                  </span>
                </p>
                <p className="MP-email">
                  <span className="MP-label">이메일</span>
                  <span className="MP-contact-value">
                    {userProfile?.email || "-"}
                  </span>
                </p>
              </div>
            </div>
            <button onClick={handleLogout} className="MP-profile-logout">
              로그아웃
            </button>
          </div>

          {/* 배송지 관리 카드 */}
          <div className="MP-card">
            <div className="MP-address-header">
              <h3>배송지 관리</h3>
              <button
                className="MP-add-address-btn"
                onClick={() => {
                  setEditAddress(null);
                  setShowAddressModal(true);
                }}
              >
                + 새 배송지 추가
              </button>
            </div>

            {isLoading ? (
              <div className="MP-loading">로딩 중...</div>
            ) : addresses.length === 0 ? (
              <div className="MP-no-address">등록된 배송지가 없습니다.</div>
            ) : (
              <div className="MP-addresses-container">
                {/* 기본 배송지 */}
                {defaultAddress && (
                  <div className="MP-address-item">
                    <div className="MP-address-badge">기본 배송지</div>
                    <div className="MP-address-info">
                      <p className="MP-address-name">
                        {defaultAddress.address_name}
                      </p>
                      <p className="MP-recipient">
                        {defaultAddress.recipient_name}
                      </p>
                      <p className="MP-address">
                        {defaultAddress.address}{" "}
                        {defaultAddress.detailed_address}
                      </p>
                      <p className="MP-phone">
                        {defaultAddress.recipient_phone}
                      </p>
                    </div>
                    <div className="MP-address-actions">
                      <button
                        className="MP-edit-btn"
                        onClick={() => handleEditAddress(defaultAddress)}
                      >
                        <FaEdit /> 편집
                      </button>
                    </div>
                  </div>
                )}

                {/* 다른 배송지 펼쳐보기 버튼 */}
                {otherAddresses.length > 0 && (
                  <button
                    className="MP-toggle-addresses"
                    onClick={() => setShowOtherAddresses(!showOtherAddresses)}
                  >
                    {showOtherAddresses ? (
                      <>
                        <FaChevronUp /> 접기
                      </>
                    ) : (
                      <>
                        <FaChevronDown /> 다른 배송지 {otherAddresses.length}개
                        보기
                      </>
                    )}
                  </button>
                )}

                {/* 다른 배송지 목록 */}
                {showOtherAddresses &&
                  otherAddresses.map((address) => (
                    <div key={address.address_id} className="MP-address-item">
                      <div className="MP-address-info">
                        <p className="MP-address-name">
                          {address.address_name}
                        </p>
                        <p className="MP-recipient">{address.recipient_name}</p>
                        <p className="MP-address">
                          {address.address} {address.detailed_address}
                        </p>
                        <p className="MP-phone">{address.recipient_phone}</p>
                      </div>
                      <div className="MP-address-actions">
                        <button
                          className="MP-set-default-btn"
                          onClick={() =>
                            handleSetDefaultAddress(address.address_id)
                          }
                        >
                          기본 배송지로 설정
                        </button>
                        <button
                          className="MP-edit-btn"
                          onClick={() => handleEditAddress(address)}
                        >
                          <FaEdit /> 편집
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* 주문 내역 카드 */}
          <div className="MP-card MP-orders-section">
            <h3>주문 내역</h3>
            <div className="MP-orders-header">
              <div className="MP-order-filters">
                <select
                  className="MP-select"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  aria-label="주문 기간 선택"
                >
                  <option value="1month">최근 1개월</option>
                  <option value="3month">최근 3개월</option>
                  <option value="6month">최근 6개월</option>
                </select>
                <select
                  className="MP-select"
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  aria-label="주문 상태 선택"
                >
                  <option value="all">전체 주문</option>
                  <option value="processing">처리중</option>
                  <option value="completed">완료</option>
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
                </tr>
              </thead>
              <tbody>{renderOrderHistory()}</tbody>
            </table>
          </div>

          {/* 쿠폰 카드 */}
          <div className="MP-card MP-coupon-card">
            <h3>쿠폰</h3>
            <p>보유 현황: 15개</p>
            <button className="MP-coupon-check-btn">쿠폰 확인</button>
          </div>

          {/* 위시리스트 */}
          <MyPageWishlist />
        </div>

        {/* 모달 */}
        {showAddressModal && (
          <AddressModal
            onClose={() => {
              setShowAddressModal(false);
              setEditAddress(null);
            }}
            onSubmit={handleAddAddress}
            onDelete={handleDeleteAddress}
            initialData={editAddress}
            isEditing={!!editAddress}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyPage;
