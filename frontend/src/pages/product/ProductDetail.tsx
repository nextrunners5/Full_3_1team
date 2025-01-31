import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CSS/ProductDetail.css";
import Footer from "../../widgets/footer/Footer";
import QnaModal from "../qna/QnaModal";

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
  const params = useParams<{ product_id: string }>();
  const product_id = params.product_id;
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [activeTab, setActiveTab] = useState("detail");
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("🔍 요청된 product_id:", product_id);

  useEffect(() => {
    if (!product_id) {
      console.error(" product_id가 존재하지 않습니다.");
      setError("잘못된 상품 정보입니다.");
      return;
    }

    // console.log(" API 요청:", `/api/products/${product_id}`);

    axios
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

  if (error) return <p>{error}</p>;
  if (!product) return <p>상품 정보를 불러오는 중...</p>;

  return (
    <div className="product-html">
      <div className="product-page">
        {/* 상단 상품 정보 */}
        <div className="product-header">
          {/* 상품 이미지 */}
          <div className="product-image">
            <img
              src={product.image_url || "https://placehold.co/500x500"}
              alt={product.product_name}
            />
          </div>

          {/* 상품 정보 */}
          <div className="product-info2">
            <h2>{product.product_name}</h2>
            <p className="rating">
              {"★".repeat(Math.floor(product.rating))}
              {"☆".repeat(5 - Math.floor(product.rating))}
              <span> ({product.review_count}개 리뷰)</span>
            </p>
            <p className="price">
              <strong>
                {Math.floor(product.final_price).toLocaleString()}원
              </strong>
              <span className="origin-price">
                {Math.floor(product.origin_price).toLocaleString()}원
              </span>
              <span className="discount-rate">
                {Math.floor(
                  (1 - product.final_price / product.origin_price) * 100
                )}
                % 할인
              </span>
            </p>

            {/* 사이즈 선택 */}
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

            {/* 수량 선택 */}
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

            {/* 버튼 */}
            <div className="button-group">
              <button className="buy-button">구매하기</button>
              <button className="cart-button">장바구니</button>
            </div>
          </div>
        </div>

        {/* 탭 버튼 */}
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

        {/* 탭에 따른 콘텐츠 */}
        <div className="tab-content">
          {activeTab === "detail" && (
            <div className="detail-content">
              {/* 상품 설명 */}
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
            <div className="review-content">리뷰 항목 만들어야함</div>
          )}
          {activeTab === "qna" && (
            <div>
            <button className="inquiry-button" onClick={() => setIsModalOpen(true)}>문의하기</button>
            {isModalOpen && <QnaModal onClose={() => setIsModalOpen(false)} />}
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
