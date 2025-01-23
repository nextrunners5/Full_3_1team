import "./OrderProductInfo.css"
const OrderProduct: React.FC = () => {
  return (
    <div className="orderProductContainer">
      <div className="repetProduct">
        <div className="midLeft">
          <img src="" alt="" className="productImg"/>
        </div>
        <div className="midRight">
          <div className="productName">프리미엄 반려동물 장난감 세트</div>
          <div className="productType">종류: 강아지용 | 사이즈: M</div>
          <div className="productPrice">89,000원 x 1개</div>
        </div>
      </div>
    </div>
  )
}

export default OrderProduct;