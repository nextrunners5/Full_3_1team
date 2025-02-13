// import React, { useState, useEffect } from "react";
// import MHeader from "../../widgets/M-header/M-header";
// import MSidebar from "../../widgets/M-sidebar/M-sidebar";
// import "./MProduct.css";

// interface Product {
//   code: string;
//   name: string;
//   category: string;
//   price: number;
//   stock: number;
//   status: "판매중" | "품절임박";
// }

// const MProduct: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [category, setCategory] = useState("전체");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   useEffect(() => {
//     setProducts([
//       { code: "PRD-001", name: "프리미엄 강아지 사료", category: "강아지 사료", price: 45000, stock: 5, status: "판매중" },
//       { code: "PRD-002", name: "고양이 모래", category: "고양이용품", price: 25000, stock: 8, status: "판매중" },
//       { code: "PRD-003", name: "강아지 장난감 세트", category: "장난감", price: 15000, stock: 12, status: "품절임박" },
//       { code: "PRD-004", name: "고양이 스크래처", category: "고양이용품", price: 35000, stock: 15, status: "판매중" },
//       { code: "PRD-005", name: "강아지 하네스", category: "의류", price: 28000, stock: 20, status: "판매중" }
//     ]);
//   }, []);

//   const filteredProducts = products
//     .filter((p) => (category === "전체" || p.category === category))
//     .filter((p) => p.name.includes(searchTerm))
//     .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   return (
//     <div className="product-wrapper">
//       <MHeader title="관리자 상품관리" />
//       <div className="product-layout">
//         <MSidebar />
//         <div className="product-container">
//           <div className="product-header">
//             <h2 className="product-title">전체 상품 목록</h2>
//             <button className="new-product-button">+ 새 상품 등록</button>
//           </div>

//           <div className="product-content-box">
//             <div className="product-search">
//               <input
//                 type="text"
//                 placeholder="상품명 검색"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="product-input"
//               />
//               <select value={category} onChange={(e) => setCategory(e.target.value)} className="product-select">
//                 <option value="전체">전체 카테고리</option>
//                 <option value="강아지 사료">강아지 사료</option>
//                 <option value="고양이용품">고양이용품</option>
//                 <option value="장난감">장난감</option>
//                 <option value="의류">의류</option>
//               </select>
//               <button className="product-search-button">검색</button>
//             </div>

//             <table className="product-table">
//               <thead>
//                 <tr>
//                   <th>상품코드</th>
//                   <th>상품명</th>
//                   <th>카테고리</th>
//                   <th>판매가</th>
//                   <th>재고</th>
//                   <th>상태</th>
//                   <th>관리</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredProducts.map((product) => (
//                   <tr key={product.code}>
//                     <td>{product.code}</td>
//                     <td>{product.name}</td>
//                     <td>{product.category}</td>
//                     <td>₩{product.price.toLocaleString()}</td>
//                     <td>{product.stock}</td>
//                     <td>
//                       <span className={product.status === "판매중" ? "status-green" : "status-orange"}>
//                         {product.status}
//                       </span>
//                     </td>
//                     <td>
//                       <button className="edit-button">수정</button>
//                       <button className="delete-button">삭제</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="pagination">
//               <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className="pagination-button">
//                 이전
//               </button>
//               {[1, 2, 3].map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => setCurrentPage(page)}
//                   className={`pagination-button ${currentPage === page ? "active" : ""}`}
//                 >
//                   {page}
//                 </button>
//               ))}
//               <button onClick={() => setCurrentPage((prev) => prev + 1)} className="pagination-button">
//                 다음
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MProduct;


// --구현된 API--

import React, { useState, useEffect } from "react";
import MHeader from "../../widgets/M-header/M-header";
import MSidebar from "../../widgets/M-sidebar/M-sidebar";
import "./MProduct.css";

interface Product {
  id: number;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "판매중" | "품절임박";
}

const MProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [category, setCategory] = useState<string>("전체");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // 상품 데이터 가져오기 (API 호출)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products/registered");
        if (!response.ok) throw new Error("상품 데이터를 불러오는 데 실패했습니다.");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "데이터 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 상품 삭제 기능
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("상품 삭제 실패");
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제 중 오류 발생");
    }
  };

  // 필터링된 상품 목록
  const filteredProducts = products
    .filter((p) => category === "전체" || p.category === category)
    .filter((p) => p.name.includes(searchTerm));

  const maxPage = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="product-wrapper">
      <MHeader title="관리자 상품관리" />
      <div className="product-layout">
        <MSidebar />
        <div className="product-container">
          <div className="product-header">
            <h2 className="product-title">전체 상품 목록</h2>
            <button className="new-product-button">+ 새 상품 등록</button>
          </div>

          <div className="product-content-box">
            {loading ? (
              <p className="loading-message">상품 데이터를 불러오는 중...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : (
              <>
                <div className="product-search">
                  <input
                    type="text"
                    placeholder="상품명 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="product-input"
                  />
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="product-select">
                    <option value="전체">전체 카테고리</option>
                    <option value="강아지 사료">강아지 사료</option>
                    <option value="고양이용품">고양이용품</option>
                    <option value="장난감">장난감</option>
                    <option value="의류">의류</option>
                  </select>
                </div>

                <table className="product-table">
                  <thead>
                    <tr>
                      <th>상품코드</th>
                      <th>상품명</th>
                      <th>카테고리</th>
                      <th>판매가</th>
                      <th>재고</th>
                      <th>상태</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.code}</td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>₩{product.price.toLocaleString()}</td>
                        <td>{product.stock}</td>
                        <td>
                          <span className={product.status === "판매중" ? "status-green" : "status-orange"}>
                            {product.status}
                          </span>
                        </td>
                        <td>
                          <button className="edit-button">수정</button>
                          <button className="delete-button" onClick={() => handleDelete(product.id)}>삭제</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pagination">
                  <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className="pagination-button">
                    이전
                  </button>
                  {Array.from({ length: maxPage }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`pagination-button ${currentPage === page ? "active" : ""}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, maxPage))} className="pagination-button">
                    다음
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MProduct;