import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { OrderProducts, OrderState } from "../../../features/order/model/OrderModel";

const initialState: OrderState = {
  orderInfo: [],
  totalPrice: 0,
}
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    updateOrderInfo: (state, action: PayloadAction<OrderProducts[]>) => {
      state.orderInfo = action.payload;
      state.totalPrice = action.payload.reduce((total, product) => total + (product.final_price * product.product_count),0);
    },
  },
});

export const {updateOrderInfo} = orderSlice.actions;
export default orderSlice.reducer;
export const selectOrderInfo = (state: {order: OrderState}) => state.order.orderInfo;
export const selectTotalPrice = (state: {order: OrderState}) => state.order.totalPrice;