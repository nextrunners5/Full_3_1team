import "./OrderDeliveryInfo.css"

const OrderDeliveryInfo: React.FC = () => {
  return (
    <div className="orderDeliveryContainer">
      <div className="orderDeliveryTitle">
        배송 정보
      </div>
      <div className="orderDeliveryBody">
        <div className="deliveryInfo">
          <div className="recipient">홍길동</div>
          <div className="addressBody">
            <div className="address">서울특별시 강남구 테헤란로 123</div>
            {/* <div className="deliveryChange" onClick={handleAddressChange}>배송지 변경</div> */}
            <div className="deliveryChange">배송지 변경</div>
          </div>
          <div className="phoneNumber">010-1234-5678</div>
        </div>
        <div className="deliveryRequest">
          <div className="requestTitle">배송 요청사항</div>
          <div className="requestToggle">
            {/* <select name="status" value={formData.status} onChange={handleChange}>
              {status.map((status) => (
                <option key={status.common_id} value={status.common_detail}>
                  {status.common_detail}
                </option>
              ))}
            </select> */}
            <select name="requestMessage" className="requestMessage">
              <option value="1" className="optionText">부재시 경비실에 맡겨주세요</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDeliveryInfo;