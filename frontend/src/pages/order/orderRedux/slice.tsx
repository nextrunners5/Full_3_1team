import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { OrderProducts, OrderState } from "../../../features/order/model/OrderModel";

const initialState: OrderState = {
  orderInfo: [],
  totalPrice: 0,
  order_id: '',
  user_id: null,
}
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    updateOrderInfo: (state, action: PayloadAction<OrderProducts[]>) => {
      state.orderInfo = action.payload;
      state.totalPrice = action.payload.reduce((total, product) => total + product.final_price * product.product_count,0);
    },
    setOrderId: (state, action: PayloadAction<string>) => {
      state.order_id = action.payload;
    },
    setOrderUserId : (state, action: PayloadAction<string|null>) => {
      state.user_id = action.payload;
      console.log('redux 업데이트', action.payload);
    }
  },
});

export const {updateOrderInfo, setOrderId, setOrderUserId} = orderSlice.actions;
export default orderSlice.reducer;
export const selectOrderInfo = (state: {order: OrderState}) => state.order.orderInfo;
export const selectTotalPrice = (state: {order: OrderState}) => state.order.totalPrice;
export const selectOrderId = (state: {order: OrderState}) => state.order.order_id;
export const selectUserId = (state: {order: OrderState}) => state.order.user_id;