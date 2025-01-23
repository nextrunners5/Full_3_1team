import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/ProductCreate.css";
import { useEffect } from "react";


const ProductCreate: React.FC = () => {
  const navigate = useNavigate();
  const [colorInput, setColorInput] = useState("");
  const [product, setProduct] = useState<{
    product_id: string;
    category_id: string;
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
    image: File | null;
    created_at: string;
    updated_at: string;
  }>({
    product_id: "",
    category_id: "",
    product_code: "",
    product_name: "",
    description: "",
    origin_price: "",
    discount_price: "",
    final_price: "",
    stock_quantity: "",
    product_status: "",
    sizes: [],
    colors: [],
    image: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  
  useEffect(() => {
    setProduct((prev) => ({
      ...prev,
      final_price: prev.origin_price && prev.discount_price
        ? (parseInt(prev.origin_price) - parseInt(prev.discount_price)).toString()
        : prev.origin_price,
    }));
  }, [product.origin_price, product.discount_price]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (["origin_price", "discount_price"].includes(name)) {
      const numericValue = value.replace(/[^0-9]/g, "");
      setProduct((prev) => {
        const updatedProduct = {
          ...prev,
          [name]: numericValue,
        };
        
        updatedProduct.final_price = (
          (parseInt(updatedProduct.origin_price) || 0) - 
          (parseInt(updatedProduct.discount_price) || 0)
        ).toString();
        return updatedProduct;
      });
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSizeChange = (size: string) => {
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
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

  console.log(product);

  return (
    <div className="product-create-container">
      <div className="product-create">
        <div className="page-header">
          <h2>새 상품 등록</h2>
          <button
            className="back-btn"
            onClick={() => navigate("/admin/products")}
          >
            ← 돌아가기
          </button>
        </div>

        <div className="form-group">
          <label>상품코드</label>
          <input
            type="text"
            name="code"
            value={product.product_code}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>상품명</label>
          <input
            type="text"
            name="name"
            value={product.product_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>카테고리</label>
          <select
            name="category"
            value={product.category_id}
            onChange={handleChange}
            required
          >
            <option value="">카테고리 선택</option>
            <option value="강아지용품">강아지용품</option>
            <option value="고양이용품">고양이용품</option>
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
                name="originPrice"
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
                name="discountPrice"
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
                name="finalPrice"
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
                name="stockQuantity"
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
                  name="status"
                  value={status}
                  checked={product.product_status === status}
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
              <span className="material-symbols-outlined">image</span>
              <p>이미지 업로드</p>
              <span>또는 드래그 앤 드롭</span>
              <small>PNG, JPG 최대 10MB</small>
            </div>
            <input
              id="image-upload"
              type="file"
              accept="image/png, image/jpeg"
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

        {/* 버튼 그룹 */}
        <div className="button-group">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/admin/products")}
          >
            취소
          </button>
          <button type="submit" className="submit-btn">
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
