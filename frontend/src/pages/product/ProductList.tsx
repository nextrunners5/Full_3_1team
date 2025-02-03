import { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/ProductList.css";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

interface Product {
  product_id: number;
  product_name: string;
  description: string;
  origin_price: number;
  discount_price: number;
  final_price: number;
  stock_quantity: number;
  product_status: string;
  created_at: string;
  updated_at: string;
  // image_url?: string; // 이미지 추후 추가 예정
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState<string>("lowPrice");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const userId = localStorage.getItem("userId") || "guest";

  useEffect(() => {
    axios
      .get<Product[]>("/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));

    if (userId === "guest") {
      // 비회원
      const storedWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );
      setWishlist(storedWishlist);
    } else {
      // 회원
      axios
        .get(`/api/wishlist?userId=${userId}`)
        .then((res) => setWishlist(res.data.wishlist))
        .catch((err) => console.error("위시리스트 가져오기 실패", err));
    }
  }, [userId]);

  // 상품 정렬
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "lowPrice") return a.final_price - b.final_price;
    if (sortOption === "highPrice") return b.final_price - a.final_price;
    return 0;
  });

  // 위시리스트 추가/삭제
  const toggleWishlist = async (productId: number) => {
    if (userId === "guest") {
      let updatedWishlist = [...wishlist];
      if (wishlist.includes(productId)) {
        updatedWishlist = wishlist.filter((id) => id !== productId);
      } else {
        updatedWishlist.push(productId);
      }
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setWishlist(updatedWishlist);
    } else {
      try {
        if (wishlist.includes(productId)) {
          await axios.delete(`/api/wishlist/${productId}`, {
            data: { userId },
          });
          setWishlist(wishlist.filter((id) => id !== productId));
        } else {
          await axios.post("/api/wishlist", { userId, productId });
          setWishlist([...wishlist, productId]);
        }
      } catch (error) {
        console.error("위시리스트 업데이트 실패", error);
      }
    }
  };

  return (
    <div className="product-page">
      <div className="banner-container">
        <h1>배너</h1>
      </div>

      <div className="controls-container">
        <h2>상품 목록</h2>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="lowPrice">낮은 가격순</option>
          <option value="highPrice">높은 가격순</option>
        </select>
      </div>

      {/* 상품 목록 */}
      <div className="products">
        {sortedProducts.map((product) => {
          const isWishlisted = wishlist.includes(product.product_id);
          // 할인율 추후 필요시
          // const discountPercentage = product.discount_price > 0
          //   ? Math.round(((product.origin_price - product.final_price) / product.origin_price) * 100)
          //   : 0;

          return (
            <div key={product.product_id} className="product-card">
              <button
                className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(product.product_id);
                }}
              >
                <Heart
                  className="heart-icon"
                  fill={isWishlisted ? "red" : "none"}
                />
              </button>

              <Link
                to={`/products/${product.product_id}`}
                className="product-link"
              >
                <img
                  src="https://placehold.co/250x250"
                  alt={product.product_name}
                />
                <div className="product-info">
                  <div className="product-title" >
                  <h3>{product.product_name}</h3>
                  

                  {/* 할인율 표시
                  {product.discount_price > 0 && (
                  <p className="discount-label">-{discountPercentage}%</p>
                )} */}
                <div className="price-container">
                  <p className="price">
                    {Math.floor(product.origin_price).toLocaleString()}원
                  </p>

                  {product.discount_price > 0 && (
                    <p className="discount">
                    ₩{Math.floor(product.final_price).toLocaleString()}
                      원
                    </p>
                  )}
                  </div>
                  </div>
                  {/* 추후 추가 */}
                  <p className="rating">별점4.2</p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
