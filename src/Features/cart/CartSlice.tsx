// CartSlice.ts (or wherever your cart slice is)
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  image: string;
  size: number;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id && item.size === newItem.size);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push(newItem);
      }

      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    removeItem(state, action: PayloadAction<string>) {
      const id = action.payload;
      const itemToRemove = state.items.find((item) => item.id === id);
      
      if (itemToRemove) {
        if (itemToRemove.quantity > 1) {
          // Decrease the quantity
          itemToRemove.quantity -= 1;
        } else {
          // Remove item if quantity is 1
          state.items = state.items.filter((item) => item.id !== id);
        }
      }
      
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
  },
});

export const { addItem, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
