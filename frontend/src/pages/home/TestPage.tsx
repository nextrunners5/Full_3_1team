import { Link} from "react-router-dom";
import "./TestPage.css"

const TestPage: React.FC = () => {
  return (
    <div className="home-btn">
      테스트 페이지 입니다.
      <button>
      <Link to={'/main'}>메인 페이지</Link>
      </button>
      <button>
      <Link to={'/login'}>로그인 페이지</Link>
      </button>
      <button>
      <Link to={'/cart'}>장바구니 페이지</Link>
      </button>
      <button>
      <Link to={'/order'}>주문 페이지</Link>
      </button>
      <button>
      <Link to={'/payment'}>결제 페이지</Link>
      </button>
      <button>
      <Link to={'/ProductCreate'}>상품 등록 페이지</Link>
      </button>
      {/* <button>
      <Link to={'/ProductDetail'}>상품 상세 페이지(상품전체페이지에서 클릭해서 들어가야함)</Link>
      </button> */}
      <button>
      <Link to={'/ProductList'}>상품 전체 페이지</Link>
      </button>
      <button>
      <Link to={'/WishList'}>위시리스트</Link>
      </button>
      
    </div>

  )
}

export default TestPage;