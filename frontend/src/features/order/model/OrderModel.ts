export interface OrderUser{
  userId?: string | null | undefined;
}

export interface UserPoint{
  point:number;
}
export interface Common{
  status_code: string;
  description: string;
}

export interface DeliveryForm{
  delivery_message_id: number;
  description: string;
}

export interface UserAddressInfo{
  address_id: number;
  user_id: string;
  address_name: string;
  recipient_name: string;
  address: string;
  detailed_address: string;
  recipient_phone: string;
  is_default: number;
}

export interface OrderProducts{
  order_id: string;
  product_id: number;
  category_id: number;
  product_name: string;
  product_count: number;
  final_amount: string;
  final_price: number;
  option_color: string;
  option_size: string;
  main_image: string;
}

export interface OrderState{
  orderInfo: OrderProducts[];
  totalPrice: number;
  order_id: string;
  user_id: string|null;
}

// export interface UpdateOrderInfoPayload {
//   products: OrderProducts[];
//   updateTotalPrice: boolean;
// }

export interface OrderCouponPointProps{
  userId?: string | null | undefined;
  points: number;
  onPointsChange: (newPoints: number) => void;
}

export interface OrderPriceProps{
  userId?: string | null | undefined;
  points: number;
  // total_productPrice: number;
}

export interface OrderShippingFee{
  shipping_fee: number;
}

export interface OrderProductsProps{
  total_price: number;
  onTotalPriceChange: (total: number) => void; 
}