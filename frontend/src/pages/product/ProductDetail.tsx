import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CSS/ProductDetail.css";
import Footer from "../../widgets/footer/Footer";
import QnaModal from "../qna/QnaModal";
import QnaList from "../qna/QnaList";
import axiosInstance from "../../shared/axios/axios";
import { createOrder } from "../../features/product/api/Product";
// import Review from "../review/Review";

interface Product {
  product_id: number;
  product_name: string;
  description: string;
  origin_price: number;
  discount_price: number;
  final_price: number;
  image_url: string;
  rating: number;
  review_count: number;
  // free_shipping: boolean;
  sizes: string[];
  colors: string[];
}

const ProductDetail: React.FC = () => {
  const { product_id } = useParams<{ product_id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [activeTab, setActiveTab] = useState("detail");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId") || "guest";

  console.log("요청된 product_id:", product_id);

  useEffect(() => {
    if (!product_id) {
      console.error(" product_id가 존재하지 않습니다.");
      setError("잘못된 상품 정보입니다.");
      return;
    }

    console.log(" API 요청:", `/api/products/${product_id}`);
    console.log(" 요청 URL:", `/products/${product_id}`);

    axiosInstance
      .get<Product>(`/api/products/${product_id}`)
      .then((res) => {
        console.log(" 상품 정보 불러오기 성공:", res.data);
        setProduct(res.data);
        setSelectedSize(res.data.sizes.length > 0 ? res.data.sizes[0] : "");
        setSelectedColor(res.data.colors.length > 0 ? res.data.colors[0] : "");
      })
      .catch((err) => {
        console.error(" 상품 정보 가져오기 실패:", err);
        setError("상품을 찾을 수 없습니다.");
      });
  }, [product_id]);

  const handleOrder = async () => {
    if (!product) {
      alert("상품 정보를 불러오는 중입니다.");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        userId,
        productId: product.product_id,
        quantity,
        totalAmount: product.origin_price * quantity,
        discountAmount: (product.origin_price - product.final_price) * quantity,
        finalAmount: product.final_price * quantity,
        shippingFee: 3000,
        selectedSize,
        selectedColor,
        statusId: "PENDING",
      };

      console.log("주문 요청 데이터:", orderData);

      const data = await createOrder(orderData);
      
      console.log("주문 완료:", data);
      alert(`주문이 성공적으로 완료되었습니다! 주문번호: ${data.orderId}`);

    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p>{error}</p>;
  if (!product) return <p>상품 정보를 불러오는 중...</p>;

  return (
    <div className="product-html">
      <div className="product-page">
        <div className="product-header">
          <div className="product-image">
            <img
              src={product.image_url || "https://placehold.co/500x500"}
              alt={product.product_name}
            />
          </div>

          <div className="product-info2">
            <h2>{product.product_name}</h2>
            <p className="rating">
              {/* {"★".repeat(Math.floor(product.rating))}
              {"☆".repeat(5 - Math.floor(product.rating))}
              <span> ({product.review_count}개 리뷰)</span> */}
              <span>??개 리뷰</span>
            </p>
            <p className="price">
              <strong>
                {Math.floor(product.final_price).toLocaleString()}원
              </strong>
              <span className="origin-price">
                {Math.floor(product.origin_price).toLocaleString()}원
              </span>
              <span className="discount-rate">
                약{" "}
                {Math.round(
                  (1 -
                    Number(
                      (product.final_price / product.origin_price).toFixed(2)
                    )) *
                    100
                )}
                % 할인
              </span>
            </p>

            {product.sizes.length > 0 && (
              <div className="select-group">
                <label>사이즈</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 색상 선택 */}
            {product.colors.length > 0 && (
              <div className="select-group">
                <label>컬러</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                >
                  {product.colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="quantity-group">
              <label>수량</label>
              <button
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
              >
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
            </div>

            {/* 배송 정보 추가해야 함 */}
            {/* {product.free_shipping && <p className="free-shipping">무료배송</p>} */}

            <div className="button-group">
              <button className="buy-button"
              onClick={handleOrder} disabled={loading}>
              {loading ? "주문 처리 중..." : "구매하기"}
              </button>
              
              <button className="cart-button">장바구니</button>
            </div>
          </div>
        </div>

        <div className="product-tabs">
          <button
            className={activeTab === "detail" ? "active" : ""}
            onClick={() => setActiveTab("detail")}
          >
            상세정보
          </button>
          <button
            className={activeTab === "review" ? "active" : ""}
            onClick={() => setActiveTab("review")}
          >
            리뷰 ({product.review_count})
          </button>
          <button
            className={activeTab === "qna" ? "active" : ""}
            onClick={() => setActiveTab("qna")}
          >
            Q&A (45)
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "detail" && (
            <div className="detail-content">
              <div className="product-description">
                <h3>상품 설명</h3>
                <p>{product.description}</p>
              </div>
              {/* 상세 이미지 */}
              <div className="product-detail-image">
                <h3>상세 이미지</h3>
                {/* <img src={product.image_url || "https://placehold.co/800x400"} alt={product.product_name}/> */}
                <img
                  src="https://placehold.co/800x400"
                  alt="상품 상세 이미지"
                />
              </div>
            </div>
          )}
          {activeTab === "review" && (
            <div className="review-content">
              리뷰 항목 만들어야함
              {/* <Review productId={product_id ?? ""} /> */}
            </div>
          )}
          {activeTab === "qna" && (
            <div className="qna-section">
              <div className="qna-header">
                <h2>상품 Q&A</h2>
                <button
                  className="inquiry-button"
                  onClick={() => setIsModalOpen(true)}
                >
                  문의하기
                </button>
              </div>
              <QnaList productId={product_id ?? ""} />
              {isModalOpen && (
                <QnaModal
                  onClose={() => setIsModalOpen(false)}
                  userId={null}
                  productId={product.product_id}
                />
              )}
            </div>
          )}
        </div>

        {/* 추천 상품 */}
        <div className="recommended-products">
          <h3>추천 상품</h3>
          {/* 추천 상품 컴포넌트 추가해야함 */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
