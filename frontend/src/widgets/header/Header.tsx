import React, { useState, useEffect } from 'react';
import './Header.css';
import SearchIcon from '../../assets/Search.png';
import CartIcon from '../../assets/Cart.png';
import BellIcon from '../../assets/Bell.png';
import MyIcon from '../../assets/My.png';

const Header: React.FC = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // 알림 개수 가져오기
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        if (response.ok) {
          const data = await response.json();
          setNotificationCount(data.count);
        } else {
          console.error('Failed to fetch notifications.');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  // 검색 처리
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      try {
        const response = await fetch(`/api/products/search?keyword=${query}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.results);
        } else {
          console.error('Failed to fetch search results.');
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchIconClick = () => {
    setIsSearchVisible((prev) => !prev);
  };

  return (
    <header className="Header-header">
      <div className="Header-logo">PETOPIA</div>
      <nav className="Header-nav">
        <a href="/about" className="Header-nav-link">ABOUT</a>
        <div className="Header-nav-dropdown">
          <button className="Header-nav-link">DOG</button>
          <div className="Header-dropdown-content">
            <a href="/dog/bathroom">BATHROOM</a>
            <a href="/dog/livingroom">LIVINGROOM</a>
            <a href="/dog/outside">OUTSIDE</a>
            <a href="/dog/kitchen">KITCHEN</a>
            <a href="/dog/clothes">CLOTHES</a>
          </div>
        </div>
        <div className="Header-nav-dropdown">
          <button className="Header-nav-link">CAT</button>
          <div className="Header-dropdown-content">
            <a href="/cat/bathroom">BATHROOM</a>
            <a href="/cat/livingroom">LIVINGROOM</a>
            <a href="/cat/outside">OUTSIDE</a>
            <a href="/cat/kitchen">KITCHEN</a>
            <a href="/cat/clothes">CLOTHES</a>
          </div>
        </div>
        {/* SUPPORT 추가 */}
        <a href="/support" className="Header-nav-link">SUPPORT</a>
      </nav>
      <div className="Header-search-cart-profile">
        <div className="Header-icons">
          <button className="Header-icon-button" onClick={handleSearchIconClick}>
            <img src={SearchIcon} alt="검색" className="Header-icon-image" />
          </button>
          {isSearchVisible && (
            <div className="Header-search-container">
              <input
                type="text"
                placeholder="찾으시는 상품을 검색해보세요"
                className="Header-search-input"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchResults.length > 0 && (
                <div className="Header-search-results">
                  {searchResults.map((result, index) => (
                    <div key={index} className="Header-search-result-item">
                      {result}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <button className="Header-icon-button">
            <img src={CartIcon} alt="장바구니" className="Header-icon-image" />
          </button>
          <button className="Header-icon-button Header-notification">
            <img src={BellIcon} alt="알람" className="Header-icon-image" />
            {notificationCount > 0 && (
              <span className="Header-notification-badge">{notificationCount}</span>
            )}
          </button>
          <button className="Header-icon-button">
            <img src={MyIcon} alt="프로필" className="Header-icon-image" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
