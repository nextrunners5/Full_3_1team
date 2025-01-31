import { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/ProductList.css";
import { Link } from "react-router-dom";

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
  // image_url?: string; // 추후 추가 예정
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState<string>("lowPrice");

  useEffect(() => {
    axios
      .get<Product[]>("/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // 상품 정렬 로직
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "lowPrice") return a.final_price - b.final_price;
    if (sortOption === "highPrice") return b.final_price - a.final_price;
    return 0;
  });

  return (
    <div className="product-page">
      {/* 상단 배너 */}
      <div className="banner-container">
        <h1>배너</h1>
      </div>

      {/* 정렬 및 컨트롤 영역 */}
      <div className="controls-container">
        <h2>상품 목록</h2>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="lowPrice">낮은 가격순</option>
          <option value="highPrice">높은 가격순</option>
        </select>
      </div>

      {/* 상품 목록 */}
      <div className="products">
        {sortedProducts.map((product) => (
          <Link to={`/products/${product.product_id}`} key={product.product_id} className="product-card">
            <img src="https://placehold.co/250x250" alt="임시" />
            <div className="product-info">
            <h3>{product.product_name}</h3>
            <p>별점 자리(추후)</p>
            <p className="price">{Math.floor(product.origin_price).toLocaleString()}원</p>
            {product.discount_price > 0 && <p className="discount">판매가: {Math.floor(product.final_price).toLocaleString()}원</p>}
            {/* <p className="status">{product.product_status}</p> */}
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
