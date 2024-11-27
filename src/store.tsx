import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './Features/cart/CartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;