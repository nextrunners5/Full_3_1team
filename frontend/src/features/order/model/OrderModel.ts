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
}

export interface OrderProducts{
  product_id: number;
  category_id: number;
  product_name: string;
  final_price: number;
}

export interface OrderCouponPointProps{
  points: number;
  onPointsChange: (newPoints: number) => void;
}

export interface OrderPriceProps{
  points: number;
}