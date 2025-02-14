import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../widgets/header/Header';
import Footer from '../../widgets/footer/Footer';

import homeImage from '../../assets/Home.jpg';
import aboutImage from '../../assets/Home2.jpg';
import bumImage from '../../assets/bum.jpg';

import "./MainPage.css";

function MainPage() {
  const [selectedCategory, setSelectedCategory] = useState("best");
  const navigate = useNavigate();

  const bestProducts = [
    { id: 1, title: "프리미엄 유기농 강아지 사료", oldPrice: "₩53,000", newPrice: "₩32,860", discount: "32%" },
    { id: 2, title: "강아지 간식", oldPrice: "₩25,000", newPrice: "₩17,500", discount: "30%" },
    { id: 3, title: "강아지 영양제", oldPrice: "₩30,000", newPrice: "₩21,000", discount: "30%" },
  ];

  const newProducts = [
    { id: 1, title: "신상 강아지 사료", oldPrice: "₩60,000", newPrice: "₩40,000", discount: "33%" },
    { id: 2, title: "신상 강아지 장난감", oldPrice: "₩20,000", newPrice: "₩14,000", discount: "30%" },
    { id: 3, title: "신상 강아지 방석", oldPrice: "₩50,000", newPrice: "₩35,000", discount: "30%" },
  ];

  const productsToShow = selectedCategory === "best" ? bestProducts : newProducts;

  return (
    <>
      <Header />
      <main className="mainContentMAIN">
        <section 
          className="heroSectionMAIN" 
          style={{ backgroundImage: `url(${homeImage})` }}
          onClick={() => navigate('/ProductList')}
        >
          <button className="heroButtonMAIN">SHOP NOW!</button>
          <h1 className="heroTitleMAIN">A BRAND FOR PETS!</h1>
        </section>

        <section className="sectionProductsMAIN">
          <div className="sectionTitleGroupMAIN">
            <button className={`productButtonMAIN ${selectedCategory === "best" ? "activeButtonMAIN" : ""}`} onClick={() => setSelectedCategory("best")}>BEST PRODUCT</button>
            <button className={`productButtonMAIN ${selectedCategory === "new" ? "activeButtonMAIN" : ""}`} onClick={() => setSelectedCategory("new")}>NEW PRODUCT</button>
          </div>

          <div className="productCardContainerMAIN">
            {productsToShow.map((product) => (
              <div 
                className="productCardMAIN" 
                key={product.id} 
                onClick={() => navigate('/ProductList')}
              >
                <div className="productImageMAIN" />
                <h3>{product.title}</h3>
                <div className="priceContainerMAIN">
                  <p className="productPriceOldMAIN">{product.oldPrice}</p>
                  <p className="productPriceNewMAIN">{product.newPrice} <span className="productSaleMAIN">{product.discount}</span></p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section 
          className="newProductsSectionMAIN" 
          onClick={() => navigate('/ProductList')}
        >
          <div className="newProductsContentMAIN">
            <div className="imageBlockMAIN">
              <img src={bumImage} alt="범퍼 침대" className="bumperImageMAIN" />
            </div>
            <div className="bumperBedContainerMAIN">
              <h2 className="newProductsTitleMAIN">New Products of the Month!</h2>
              <h2 className="bumperBedTitleMAIN">범퍼 침대</h2>
              <p>아이들이 좋아하는 러그와 이불 침대를<br />하나로 담은 올인원 범퍼 침대로<br />프리미엄 호텔 침구 원단을 사용해 더욱 포근합니다.</p>
            </div>
          </div>
        </section>

        <section 
          className="brandSectionMAIN" 
          style={{ backgroundImage: `url(${aboutImage})` }}
          onClick={() => navigate('/About')}
        >
          <h1 className="brandTitleMAIN">PETOPIA</h1>
          <p className="brandDescMAIN">펫 토피아는 우리 아이들이 건강하게 뛰어놀 수 있도록 안전하고<br />행복한 일상을 만들어주는 반려동물 전문 브랜드 입니다.</p>
          <button className="aboutButtonMAIN">ABOUT US</button>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default MainPage;
