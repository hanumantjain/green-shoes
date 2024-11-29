import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './Features/cart/CartSlice'
import userReducer from './Features/cart/UserSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;