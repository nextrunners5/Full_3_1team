import { Link, useNavigate } from "react-router-dom";
import axios from '../../shared/axios/axios';
import "./TestPage.css"

const TestPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post('/auth/logout');
      if (response.data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <div className="test-container">
      <div className="header">
        <button 
          onClick={handleLogout}
          className="logout-button"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '8px 16px',
            backgroundColor: '#ff4d4f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          로그아웃
        </button>
      </div>
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
        <button>
        <Link to={'/ProductBoard'}>상품 관리 페이지</Link>
        </button>
        
      </div>
    </div>
  )
}

export default TestPage;