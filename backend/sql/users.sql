DROP DATABASE IF EXISTS v5;
CREATE DATABASE v5;
USE v5;

-- Users 테이블 생성
CREATE TABLE IF NOT EXISTS Users (
    user_id VARCHAR(50) PRIMARY KEY,
    kakao_id BIGINT UNIQUE,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    signup_type ENUM('local', 'kakao', 'naver', 'google') NOT NULL DEFAULT 'local',
    is_active BOOLEAN NOT NULL DEFAULT true,
    membership_level VARCHAR(20) NOT NULL DEFAULT 'BASIC',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    recent_at TIMESTAMP,
    profile_image VARCHAR(255),
    isAdmin BOOLEAN NOT NULL DEFAULT false,
    point INT NOT NULL DEFAULT 0,
    INDEX idx_kakao_id (kakao_id),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- UserAuth 테이블 생성
CREATE TABLE IF NOT EXISTS UserAuth (
    auth_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    auth_type ENUM('local', 'kakao', 'naver', 'google') NOT NULL,
    external_id VARCHAR(100),
    password VARCHAR(255),
    access_token TEXT,
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_external_id (external_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- UserAddresses 테이블 생성
CREATE TABLE IF NOT EXISTS UserAddresses (
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    address_name VARCHAR(100),
    recipient_name VARCHAR(50) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    detailed_address VARCHAR(255),
    postal_code VARCHAR(10) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT false,
    address_label VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Common 테이블 생성 (상태 코드 관리)
CREATE TABLE IF NOT EXISTS Common (
    status_code VARCHAR(50) PRIMARY KEY,
    status_type VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products 테이블 생성
CREATE TABLE IF NOT EXISTS Products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    origin_price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),
    final_price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    product_status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    product_code VARCHAR(50) UNIQUE NOT NULL,
    product_image VARCHAR(255),
    sizes JSON,
    colors JSON,
    INDEX idx_category (category_id),
    INDEX idx_product_code (product_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ProductOptions 테이블 생성
CREATE TABLE IF NOT EXISTS ProductOptions (
    option_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    option_name VARCHAR(50) NOT NULL,
    option_value VARCHAR(50) NOT NULL,
    additional_price DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders 테이블 생성
CREATE TABLE IF NOT EXISTS Orders (
    order_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    status_id VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shipping_fee DECIMAL(10,2) DEFAULT 0,
    order_type VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES Common(status_code),
    INDEX idx_user (user_id),
    INDEX idx_order_date (order_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- OrderItems 테이블 생성
CREATE TABLE IF NOT EXISTS OrderItems (
    orderItems_id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    product_id INT NOT NULL,
    order_status VARCHAR(50) NOT NULL,
    product_count INT NOT NULL,
    option_size VARCHAR(50),
    option_color VARCHAR(50),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (order_status) REFERENCES Common(status_code),
    INDEX idx_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payment 테이블 생성
CREATE TABLE IF NOT EXISTS Payment (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(50) NOT NULL,
    payment_key VARCHAR(200) UNIQUE NOT NULL,
    order_name VARCHAR(100) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    final_price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2) DEFAULT 0,
    currency CHAR(3) DEFAULT 'KRW',
    payment_status VARCHAR(50) NOT NULL,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_status) REFERENCES Common(status_code),
    INDEX idx_payment_key (payment_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Delivery 테이블 생성
CREATE TABLE IF NOT EXISTS Delivery (
    delivery_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(50) NOT NULL,
    delivery_status VARCHAR(50) NOT NULL,
    delivery_address VARCHAR(255) NOT NULL,
    delivery_date TIMESTAMP,
    delivery_message VARCHAR(50),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (delivery_status) REFERENCES Common(status_code),
    INDEX idx_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Review 테이블 생성
CREATE TABLE IF NOT EXISTS Review (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    product_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ProductImages 테이블 생성
CREATE TABLE IF NOT EXISTS ProductImages (
  product_id INT NOT NULL,
  main_image VARCHAR(255),
  detail_images JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (product_id),
  FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- ProductCategories 테이블 생성
CREATE TABLE IF NOT EXISTS ProductCategories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 기본 카테고리 데이터 삽입
INSERT INTO ProductCategories (category_name, description) VALUES
('사료', '반려동물 사료'),
('간식', '반려동물 간식'),
('장난감', '반려동물 장난감'),
('의류', '반려동물 의류'),
('위생용품', '반려동물 위생용품');

-- Common 테이블 기본 데이터 삽입
INSERT INTO Common (status_code, status_type, description) VALUES
-- 주문 상태
('ORDER_PENDING', 'ORDER', '주문 대기'),
('ORDER_COMPLETE', 'ORDER', '주문 완료'),
('ORDER_CANCELED', 'ORDER', '주문 취소'),
-- 결제 상태
('PAYMENT_PENDING', 'PAYMENT', '결제 대기'),
('PAYMENT_COMPLETE', 'PAYMENT', '결제 완료'),
('PAYMENT_FAILED', 'PAYMENT', '결제 실패'),
('PAYMENT_CANCELED', 'PAYMENT', '결제 취소'),
-- 배송 상태
('DELIVERY_PREPARING', 'DELIVERY', '배송 준비중'),
('DELIVERY_SHIPPING', 'DELIVERY', '배송중'),
('DELIVERY_COMPLETE', 'DELIVERY', '배송 완료'),
-- 배송 메시지
('DM_DOOR', 'DELIVERY_MESSAGE', '문 앞에 놓아주세요'),
('DM_SECURITY', 'DELIVERY_MESSAGE', '경비실에 맡겨주세요'),
('DM_CALL', 'DELIVERY_MESSAGE', '배송 전 연락 부탁드립니다'),
('DM_QUICK', 'DELIVERY_MESSAGE', '빠른 배송 부탁드립니다');

-- 테스트용 관리자 계정 생성
INSERT INTO Users 
(user_id, name, email, phone, signup_type, isAdmin) 
VALUES 
('admin', '관리자', 'admin@petopia.com', '010-0000-0000', 'local', true);

INSERT INTO UserAuth 
(user_id, auth_type, password) 
VALUES 
('admin', 'local', '$2b$10$8KzaNdKIMyOkASCCfTYrU.kXsyeqf0lrWA.O6DgEE/ZgqzUh5HKPy');

-- 테스트용 일반 회원 계정 생성
INSERT INTO Users 
(user_id, name, email, phone, signup_type) 
VALUES 
('testuser', '테스트유저', 'test@petopia.com', '010-1234-5678', 'local');

INSERT INTO UserAuth 
(user_id, auth_type, password) 
VALUES 
('testuser', 'local', '$2b$10$8KzaNdKIMyOkASCCfTYrU.kXsyeqf0lrWA.O6DgEE/ZgqzUh5HKPy');

-- 테스트용 배송지 데이터 생성
INSERT INTO UserAddresses 
(user_id, address_name, recipient_name, recipient_phone, address, detailed_address, postal_code, is_default) 
VALUES 
('testuser', '집', '테스트유저', '010-1234-5678', '서울시 강남구 테헤란로', '123-45', '06234', true); 