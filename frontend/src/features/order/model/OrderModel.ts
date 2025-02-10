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
  product_id: number;
  category_id: number;
  product_name: string;
  product_count: number;
  final_amount: string;
  final_price: number;
  option_color: string;
  option_size: string;
}

export interface OrderState{
  orderInfo: OrderProducts[];
  totalPrice: number;
}

export interface OrderCouponPointProps{
  points: number;
  onPointsChange: (newPoints: number) => void;
}

export interface OrderPriceProps{
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