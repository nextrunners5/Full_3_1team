import React, { useState } from "react";
import "./CSS/ProductCreate.css"

interface ProductImgProps {
  onUpload: (mainImage: File | null, detailImages: File[]) => void;
}

const ProductImg: React.FC<ProductImgProps> = ({ onUpload }) => {
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [detailImages, setDetailImages] = useState<File[]>([]);

  // 대표 이미지 업로드 핸들러
  const handleMainImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setMainImage(file);
      onUpload(file, detailImages); // 부모 컴포넌트로 데이터 전달
    }
  };

  // 상세 이미지 업로드 핸들러
  const handleDetailImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setDetailImages((prev) => [...prev, ...filesArray]);
      onUpload(mainImage, [...detailImages, ...filesArray]); // 부모 컴포넌트로 데이터 전달
    }
  };

  return (
    <div className="img-box">
      {/* 대표 이미지 (왼쪽) */}
      <div className="image-section">
        <h2>대표 이미지</h2>
        <label htmlFor="main-image-upload" className="image-upload-box">
          <div className="image-preview">
            {mainImage ? (
              <img src={URL.createObjectURL(mainImage)} alt="대표 이미지" />
            ) : (
              <>
                <span className="material-symbols-outlined">image</span>
                <p>이미지 업로드</p>
                <span>또는 드래그 앤 드롭</span>
                <small>PNG, JPG 최대 10MB</small>
              </>
            )}
          </div>
          <input
            id="main-image-upload"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleMainImageUpload}
            hidden
          />
        </label>
      </div>

      {/* 상세 이미지 (오른쪽) */}
      <div className="image-section">
        <h2>상세 이미지</h2>
        <label htmlFor="detail-image-upload" className="image-upload-box">
          <div className="image-preview">
            {detailImages.length > 0 ? (
              detailImages.map((image, index) => (
                <img key={index} src={URL.createObjectURL(image)} alt={`상세 이미지 ${index}`} />
              ))
            ) : (
              <>
                <span className="material-symbols-outlined">image</span>
                <p>이미지 업로드</p>
                <span>또는 드래그 앤 드롭</span>
                <small>PNG, JPG 최대 10MB</small>
              </>
            )}
          </div>
          <input
            id="detail-image-upload"
            type="file"
            multiple
            accept="image/png, image/jpeg"
            onChange={handleDetailImageUpload}
            hidden
          />
        </label>
      </div>
    </div>
  );
};

export default ProductImg;
