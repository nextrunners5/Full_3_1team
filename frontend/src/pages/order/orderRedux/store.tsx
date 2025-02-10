import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "./slice";

const orderStore = configureStore({
  reducer: {
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof orderStore.getState>;
export default orderStore;