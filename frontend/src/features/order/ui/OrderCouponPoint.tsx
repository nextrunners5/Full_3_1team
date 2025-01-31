import "./OrderCouponPint.css"

const OrderCouponPoint: React.FC = () => {
  return (
    <div className="orderCouponPointContainer">
      <form className="couponContainer">
        <div className="selectCouponTitle">쿠폰 적용</div>
        <div className="selectCoupon">
            {/* <select name="status" value={formData.status} onChange={handleChange}>
              {status.map((status) => (
                <option key={status.status_code} value={status.description}>
                  {status.common_detail}
                </option>
              ))}
            </select> */}
            <select name="requestMessage" className="requestMessage">
              <option value="1" className="optionText">신규가입 할인 쿠폰</option>
            </select>
            <div className="couponText">신규 가입 10% 할인 쿠폰이 적용되었습니다.(-8,900원)</div>
        </div>
      </form>
      <form className="pointContainer">
        <div className="pointTitle">포인트 사용</div>
        <div className="pointBody">
          <input 
                type="text" 
                name='title'
                placeholder='사용할 포인트'
                // value=
                // onChange=
                />
          <div className="remainPoint">보유: 5,000 point</div>
        </div>
      </form>
    </div>
  )
}

export default OrderCouponPoint;