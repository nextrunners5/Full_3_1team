import { Link} from "react-router-dom";
import "./css/TestPage.css"

const TestPage: React.FC = () => {
  return (
    <div>
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
      <Link to={'/product'}>상품 페이지</Link>
      </button>
    </div>

  )
}

export default TestPage;