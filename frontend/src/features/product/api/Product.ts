import axiosInstance from "axios";
import { Product, OrderProduct } from "../model/ProductModel"

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

export default axiosInstance;