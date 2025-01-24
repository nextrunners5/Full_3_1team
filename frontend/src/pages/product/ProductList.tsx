import React, { useEffect, useState } from "react";
import { fetchProducts } from "../../shared/axios/ProductsAxios";

interface Product {
  product_id: number;
  product_code: string;
  category_id: number;
  product_name: string;
  description: string;
  origin_price: number;
  discount_price: number;
  final_price: number;
  stock_quantity: number;
  product_status: string;
  sizes: string[];
  colors: string[];
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 상품 목록 가져오기
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("상품 목록 불러오기 오류:", error); // 오류 출력
        setError("상품 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) return <p>상품을 불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>상품 목록</h2>

      <thead>
        <tr>
          <th>상품 ID</th>
          <th>상품 코드</th>
          <th>카테고리 ID</th>
          <th>상품명</th>
          <th>가격</th>
          <th>재고 수량</th>
          <th>상태</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.product_id}>
            <td>{product.product_id}</td>
            <td>{product.product_code}</td>
            <td>{product.category_id}</td>
            <td>{product.product_name}</td>
            <td>{product.final_price.toLocaleString()}원</td>
            <td>{product.stock_quantity}</td>
            <td>{product.product_status}</td>
          </tr>
        ))}
      </tbody>
    </div>
  );
};

export default ProductList;
