import axiosInstance from "../../../shared/axios/axios";
import { OrderProducts, OrderShippingFee, UserAddressInfo } from "../model/OrderModel";

//사용자 포인트 가져오기
export const fetchUserPoints = async(userId: string | null | undefined) => {
  try{
    const response = await axiosInstance.get(`/api/orders/UserPoints/${userId}`);
    return response.data;
  } catch(err){
    console.error('사용자의 포인트를 가져오지 못했습니다.', err);
  }
};

//배송메시지 가져오기
export const fetchDeliveryMessage = async () => {
  try{
    const response = await axiosInstance.get('/api/orders/DeliveryMessage');
    console.log("res: ",response.data);
    return response.data;
  } catch(err){
    console.error('배송 메시지를 불러오지 못했습니다.', err);
  }
};

//배송지 정보 가져오기
export const fetchAddress = async(userId: string | null | undefined) => {
  try{
    console.log('fetchAddress 실행됨 userId', userId);
    const response = await axiosInstance.get<UserAddressInfo[]>(`/api/orders/UserAddress/${userId}`);
    console.log("프론트 address response: ", response.data);
    console.log("프론트 address response: ", response.status);
    return response.data;
  } catch(err){
    console.error('배송지 정보를 가져오지 못했습니다.', err);
    return null;
  }
};

//배송지 상세 리스트 정보 가져오기
export const fetchDetailsAddress = async(userId: string | null | undefined) => {
  try{
    const response = await axiosInstance.get<UserAddressInfo[]>(`/api/orders/UserDetailsAddress/${userId}`);
    console.log("DetailsAddress response: ", response.data);
    return response.data;
  } catch(err){
    console.error('배송지 상세 리스트 정보를 가져오지 못했습니다.', err);
  }
};

//주문 제품 정보 가져오기
export const fetchOrderProducts = async(userId: string | null | undefined) => {
  try{
    const response = await axiosInstance.get<OrderProducts[]>(`/api/orders/OrderProducts/${userId}`);
    console.log('orderProductInfo: ',  response.data);
    return response.data;
  } catch(err){
    console.error('주문 제품 정보를 가져오지 못했습니다.', err);
  }
};

//주문 제품 이미지 가져오기
export const fetchOrderProductImage = async(product_id: number) => {
  try{
    const response = await axiosInstance.get<{main_image: string}>(`/api/${product_id}`);
    if(response.data && response.data.main_image){
      return response.data.main_image;
    }
    console.log('이미지데이터' , response.data.main_image);
    // return response.data;
  } catch(err){
    console.error('상품 이미지 데티어 조회 실패', err);
    throw err;
  }
}

//배송비 정보 가져오기
export const fetchShippingFee = async(userId: string | null | undefined) => {
  try{
    console.log('fetchShoppingFee 유저 아이디',userId);
    const response = await axiosInstance.get<OrderShippingFee[]>(`/api/orders/OrderShippingFee/${userId}`);
    console.log('APIshippingFee: ',response);
    console.log('APIshippingFee: ',response.data);
    return response.data;
  } catch(err){
    console.error('배송비 정보를 가져오지 못했습니다.', err);
  }
};

export const fetchProcessPayment = async(order_id: string, final_price: number, selectedAddress: UserAddressInfo | null,  selectedMessage: string) => {
  try{
    const response = await axiosInstance.post('/api/payments', {
      order_id,
      final_price,
      selectedAddress,
      selectedMessage
    });
    return response.data;
  } catch(err){
    console.error('결제 요청 실패', err);
  }
}

