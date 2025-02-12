import axiosInstance from "../../../shared/axios/axios";
import { OrderProducts, OrderShippingFee, UserAddressInfo } from "../model/OrderModel";

//사용자 포인트 가져오기
export const fetchUserPoints = async() => {
  try{
    const response = await axiosInstance.get('/api/orders/UserPoints');
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
export const fetchAddress = async() => {
  try{
    const response = await axiosInstance.get<UserAddressInfo[]>('/api/orders/UserAddress');
    console.log("address response: ", response.data);
    return response.data;
  } catch(err){
    console.error('배송지 정보를 가져오지 못했습니다.', err);
  }
};

//배송지 상세 리스트 정보 가져오기
export const fetchDetailsAddress = async() => {
  try{
    const response = await axiosInstance.get<UserAddressInfo[]>('/api/orders/UserDetailsAddress');
    console.log("DetailsAddress response: ", response.data);
    return response.data;
  } catch(err){
    console.error('배송지 상세 리스트 정보를 가져오지 못했습니다.', err);
  }
};

//주문 제품 정보 가져오기
export const fetchOrderProducts = async() => {
  try{
    const response = await axiosInstance.get<OrderProducts[]>('/api/orders/OrderProducts');
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
export const fetchShippingFee = async() => {
  try{
    const response = await axiosInstance.get<OrderShippingFee[]>('/api/orders/OrderShippingFee');
    console.log('APIshippingFee: ',response.data);
    return response.data;
  } catch(err){
    console.error('배송비 정보를 가져오지 못했습니다.', err);
  }
};

export const fetchProcessPayment = async(order_id: string, final_price: number) => {
  try{
    const response = await axiosInstance.post('/api/payments', {
      order_id,
      final_price,
    });
    return response.data;
  } catch(err){
    console.error('결제 요청 실패', err);
  }
}


export const fetchPostOrderProducts = async() => {
  try{
    const response = await axiosInstance.post('/api/orders/OrderSingleProduct');
    console.log('frontend single product: ', response.data);
    return response.data;
  } catch(err){
    console.error('주문하려는 단일 상품 정보 저장 실패', err);
  }
}
