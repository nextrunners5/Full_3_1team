DROP DATABASE IF EXISTS v5;
CREATE DATABASE v5;
USE v5;

-- Users 테이블 생성
CREATE TABLE Users (
    user_id VARCHAR(50) PRIMARY KEY,
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
    INDEX idx_email (email)
);

-- UserAuth 테이블 생성
CREATE TABLE UserAuth (
    auth_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    auth_type ENUM('local', 'kakao', 'naver', 'google') NOT NULL,
    password VARCHAR(255),
    refresh_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_auth (user_id, auth_type)
);

-- 배송지 테이블
CREATE TABLE UserAddresses (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    address_name VARCHAR(100) NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    detailed_address VARCHAR(255),
    postal_code VARCHAR(10) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_user_default (user_id, is_default)
) COMMENT '사용자 배송지 정보';

-- ProductCategories 테이블
CREATE TABLE ProductCategories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products 테이블
CREATE TABLE Products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    origin_price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2) DEFAULT 0.00,
    final_price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    product_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    product_code VARCHAR(50) NOT NULL,
    sizes JSON,
    colors JSON,
    FOREIGN KEY (category_id) REFERENCES ProductCategories(category_id)
);

-- ProductImages 테이블
CREATE TABLE ProductImages (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);

-- Payment 테이블
CREATE TABLE Payment (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(100) NOT NULL,
    payment_key VARCHAR(200) NOT NULL,
    payment_type INT NOT NULL,
    order_name VARCHAR(100) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    final_price DECIMAL(10, 2) NOT NULL,
    balance_amount DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'KRW',
    payment_status VARCHAR(20) NOT NULL,
    requested_at TIMESTAMP NOT NULL,
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_payment_key (payment_key),
    INDEX idx_order_id (order_id),
    INDEX idx_payment_status (payment_status)
);

-- 테스트용 데이터 삽입
INSERT INTO Users 
(user_id, name, email, phone, signup_type, isAdmin) 
VALUES 
('admin', '관리자', 'admin@petopia.com', '010-0000-0000', 'local', true);

INSERT INTO UserAuth 
(user_id, auth_type, password) 
VALUES 
('admin', 'local', '$2b$10$8KzaNdKIMyOkASCCfTYrU.kXsyeqf0lrWA.O6DgEE/ZgqzUh5HKPy');

-- 테스트용 일반 회원 계정
INSERT INTO Users 
(user_id, name, email, phone, signup_type) 
VALUES 
('testuser', '테스트유저', 'test@petopia.com', '010-1234-5678', 'local');

INSERT INTO UserAuth 
(user_id, auth_type, password) 
VALUES 
('testuser', 'local', '$2b$10$8KzaNdKIMyOkASCCfTYrU.kXsyeqf0lrWA.O6DgEE/ZgqzUh5HKPy');

-- 테스트용 배송지 데이터
INSERT INTO UserAddresses 
(user_id, address_name, recipient_name, recipient_phone, address, detailed_address, postal_code, is_default) 
VALUES 
('testuser', '집', '테스트유저', '010-1234-5678', '서울시 강남구 테헤란로', '123-45', '06234', true);

-- 카테고리 데이터 삽입
INSERT INTO ProductCategories (category_name) VALUES
('강아지 사료'),
('강아지 간식'),
('강아지 장난감'),
('강아지 용품'),
('강아지 집'),
('강아지 옷'),
('강아지 위생 용품'),
('강아지 건강관리'),
('강아지 미용 용품'),
('강아지 이동장'),
('강아지 훈련 용품');