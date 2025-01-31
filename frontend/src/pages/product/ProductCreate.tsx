import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/ProductCreate.css";
import axios from 'axios';
import { createProduct } from "../../shared/axios/ProductsAxios";

const ProductCreate: React.FC = () => {
  const navigate = useNavigate();
  const [colorInput, setColorInput] = useState("");
  const [categories, setCategories] = useState<{ category_id: number; category_name: string }[]>([]);
  const [product, setProduct] = useState<{
    product_id: string;
    category_id: number;
    product_code: string;
    product_name: string;
    description: string;
    origin_price: string;
    discount_price: string;
    final_price: string;
    stock_quantity: string;
    product_status: string;
    sizes: string[];
    colors: string[];
    created_at: string;
    updated_at: string;
  }>({
    product_id: "",
    category_id: 0,
    product_code: "",
    product_name: "",
    description: "",
    origin_price: "",
    discount_price: "",
    final_price: "",
    stock_quantity: "",
    product_status: "",
    sizes: [] as string[],
    colors: [] as string[],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  useEffect(() => {
    setProduct((prev) => ({
      ...prev,
      final_price:
        prev.origin_price && prev.discount_price
          ? (
              parseInt(prev.origin_price) - parseInt(prev.discount_price)
            ).toString()
          : prev.origin_price,
    }));
  }, [product.origin_price, product.discount_price]);

  // 카테고리 목록을 백엔드에서 가져오기
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/categories");
    
        console.log("카테고리 응답:", response);
    
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error("잘못된 데이터 형식:", response.data);
          setCategories([]);
        }
      } catch (error) {
        console.error("카테고리 목록 불러오기 실패:", error);
        setCategories([]);
      }
    };
    
    useEffect(() => {
      fetchCategories();
    }, []);
    
    const statusMap: { [key: string]: string } = {
      "판매중": "PRS001",
      "품절": "PRS002",
      "숨김": "PRS003",
    };
    
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
    
      setProduct((prev) => {
        let updatedValue: string | number = value;
    
        // 숫자만 입력 가능한 필드 처리
        if (["origin_price", "discount_price", "stock_quantity"].includes(name)) {
          updatedValue = value.replace(/[^0-9]/g, "");
        }
    
        // category_id는 숫자로 변환
        if (name === "category_id") {
          updatedValue = parseInt(value, 10) || 0;
        }
    
        // product_status 변환 (한글 → status_code)
        if (name === "product_status") {
          updatedValue = statusMap[value] || value; // 한글 상태명을 status_code로 변환
        }
    
        const updatedProduct = {
          ...prev,
          [name]: updatedValue,
        };
    
        // 가격 계산
        if (name === "origin_price" || name === "discount_price") {
          updatedProduct.final_price = (
            (parseInt(updatedProduct.origin_price) || 0) - (parseInt(updatedProduct.discount_price) || 0)
          ).toString();
        }
    
        return updatedProduct;
      });
    };
    
    

  const handleSizeChange = (size: string) => {
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
    }));
  };

  const handleColorAdd = () => {
    if (colorInput.trim() && !product.colors.includes(colorInput.trim())) {
      setProduct((prev) => ({
        ...prev,
        colors: [...prev.colors, colorInput.trim()],
      }));
      setColorInput("");
    }
  };

  const handleColorRemove = (color: string) => {
    setProduct((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const formattedProduct = {
      ...product,
      origin_price: parseFloat(product.origin_price) || 0,
      discount_price: parseFloat(product.discount_price) || 0,
      final_price: parseFloat(product.final_price) || 0,
      stock_quantity: parseInt(product.stock_quantity, 10) || 0,  
    };
  
    try {
      const response = await createProduct(formattedProduct);
      console.log("상품 등록 성공", response.data);

      // navigate("/products"); // 상품 목록 페이지 완성 후 복구
    } catch (error) {
      console.error("상품 등록 실패", error);
    }
  };
  

  return (
    <div className="product-create-container">
      <form onSubmit={handleSubmit}>
        <div className="product-create">
          <div className="page-header">
            <h2>새 상품 등록</h2>
            <button className="back-btn" onClick={() => navigate("/")}>
              ← 돌아가기
            </button>
          </div>

          <div className="form-group">
            <label>상품코드</label>
            <input
              type="text"
              name="product_code"
              value={product.product_code}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>상품명</label>
            <input
              type="text"
              name="product_name"
              value={product.product_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>카테고리</label>
            <select name="category_id" value={product.category_id} onChange={handleChange} required>
              <option value="">카테고리 선택</option>
              {categories?.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          {/* 가격 정보 & 상품 수량 */}
          <div className="price-stock-container">
            <div className="price-info">
              <h2>가격 정보</h2>
              <div className="price-form-group">
                <label>상품 원가</label>
                <input
                  type="text"
                  name="origin_price"
                  placeholder="₩"
                  value={product.origin_price ? `₩${product.origin_price}` : ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="price-form-group">
                <label>할인 가격</label>
                <input
                  type="text"
                  name="discount_price"
                  placeholder="₩"
                  value={
                    product.discount_price ? `₩${product.discount_price}` : ""
                  }
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="price-form-group">
                <label>상품 판매가</label>
                <input
                  type="text"
                  name="final_price"
                  placeholder="₩"
                  value={product.final_price ? `₩${product.final_price}` : ""}
                  readOnly
                />
              </div>
            </div>

            <div className="stock-info">
              <h2>상품 수량</h2>
              <div className="stock-form-group">
                <label>재고 수량</label>
                <input
                  type="text"
                  name="stock_quantity"
                  placeholder="1 개"
                  value={product.stock_quantity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* 상품 옵션 */}
          <h2>상품 옵션</h2>
          <label>사이즈</label>
          <div className="size-form-group">
            {["S", "M", "L", "XL"].map((size) => (
              <label key={size}>
                <input
                  type="checkbox"
                  checked={product.sizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                />
                {size}
              </label>
            ))}
          </div>

          <div className="status-form-group">
            <label>판매 상태</label>
            <div className="status-options">
              {["판매중", "품절", "숨김"].map((status) => (
                <label key={status}>
                  <input
                    type="radio"
                    name="product_status"
                    value={status}
                    checked={statusMap[status] === product.product_status}
                    onChange={handleChange}
                  />
                  {status}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 색상 추가 */}
        <div className="color-form-group">
          <h2>색상</h2>
          <div className="color-input">
            <input
              type="text"
              placeholder="색상 입력"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
            />
            <button type="button" onClick={handleColorAdd}>
              +
            </button>
          </div>
          <div className="color-list">
            {product.colors.map((color, index) => (
              <div key={index} className="color-tag">
                <span>{color}</span>
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => handleColorRemove(color)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 상품 이미지 업로드 */}
        <div className="img-container">
          <div className="image-upload-section">
            <h2>상품 이미지</h2>
            <label htmlFor="image-upload" className="image-upload-box">
              <div className="image-preview">
                  <>
                    <span className="material-symbols-outlined">image</span>
                    <p>이미지 업로드</p>
                    <span>또는 드래그 앤 드롭</span>
                    <small>PNG, JPG 최대 10MB</small>
                  </>
              </div>
              <input
                id="image-upload"
                // type="file"
                // accept="image/png, image/jpeg"
                // onChange={handleImageUpload}
                hidden
              />
            </label>
          </div>

          {/* 상품 설명 입력 */}
          <div className="description-section">
            <h2>상품 설명</h2>
            <textarea
              name="description"
              placeholder="상품 설명을 입력하세요"
              value={product.description}
              onChange={handleChange}
            />
          </div>

          <div className="debug-section">
          <h3>(임시) 입력된 데이터 확인</h3>
          <pre>{JSON.stringify(product, null, 2)}</pre>
        </div>

          {/* 버튼 그룹 */}
          <div className="button-group">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/")}
            >
              취소
            </button>
            <button type="submit" className="submit-btn">
              저장하기
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;
