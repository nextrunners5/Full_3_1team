//엔티티 
//Table 객체로 변환 
//보통 클래스로 관리

// class Orders{
//   id: number;
// }

export interface Payment {
  id?: number;
  paymentKey: string;
  orderId: string;
  amount: number;
  status: 'READY' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILED' | 'CANCELED';
  paymentData?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Payments {
  constructor(private payment: Payment) {}

  static create(payment: Payment): Payments {
    return new Payments(payment);
  }

  getPayment(): Payment {
    return this.payment;
  }
}