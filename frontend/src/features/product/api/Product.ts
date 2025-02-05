import axiosInstance from "axios";
import { Product, OrderProduct, CartProduct } from "../model/ProductModel"

// 상품 등록 API 요청
export const createProduct = async (productData: Product) => {
  try {
    const response = await axiosInstance.post("/api/products", productData);
    return response.data;
  } catch (error) {
    console.error("상품 등록 실패:", error);
    throw error;
  }
};

// 상품 목록 조회 API 요청
export const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get("/api/products");
    return response.data;
  } catch (error) {
    console.error("상품 목록 불러오기 실패:", error);
    throw error;
  }
};

// 상품 상세 조회 API 요청
export const getProductById = async (product_id: number) => {
  try {
    const response = await axiosInstance.get(`/api/products/${product_id}`);
    return response.data;
  } catch (error) {
    console.error(`상품 상세 조회 실패 (ID: ${product_id}):`, error);
    throw error;
  }
};

// 상품 주문 API 요청
export const createOrder = async (orderData: OrderProduct) => {
  try {
    const response = await axiosInstance.post("/api/orders", orderData);
    return response.data;
  } catch (error) {
    console.error(`주문 생성 실패 (상품 ID: ${orderData.productId}):`, error);
    throw error;
  }
};

// 상품 장바구니 API 요청
export const createCart = async (cartData: CartProduct) => {
  try {
    const response = await axiosInstance.post("/api/cart", cartData);
    return response.data;
  } catch (error) {
    console.error(`장바구니 추가 실패 (상품 ID: ${cartData.productId}):`, error);
    throw error;
  }
};

// 이미지 업로드
export const uploadImages = async (mainImage: File, detailImages: File[]) => {
  const formData = new FormData();
  formData.append("mainImage", mainImage);
  detailImages.forEach((file, index) => {
    formData.append(`detailImage${index}`, file);
  });

  const response = await axiosInstance.post("/api/products/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};
export default axiosInstance;