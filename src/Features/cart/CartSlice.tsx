// CartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

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

// Load initial state from cookies
const loadCartFromCookies = (): CartState => {
  const items = Cookies.get('cartItems');
  const totalAmount = Cookies.get('cartTotalAmount');
  return {
    items: items ? JSON.parse(items) : [],
    totalAmount: totalAmount ? parseFloat(totalAmount) : 0,
  };
};

const saveCartToCookies = (state: CartState) => {
  Cookies.set('cartItems', JSON.stringify(state.items), { expires: 7 });
  Cookies.set('cartTotalAmount', state.totalAmount.toString(), { expires: 7 });
};

const initialState: CartState = loadCartFromCookies();

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
      saveCartToCookies(state); // Save to cookies
    },
    removeItem(state, action: PayloadAction<string>) {
      const id = action.payload;
      const itemToRemove = state.items.find((item) => item.id === id);

      if (itemToRemove) {
        if (itemToRemove.quantity > 1) {
          itemToRemove.quantity -= 1;
        } else {
          state.items = state.items.filter((item) => item.id !== id);
        }
      }

      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      saveCartToCookies(state); // Save to cookies
    },
    clearCart(state) {
      state.items = [];
      state.totalAmount = 0;
      saveCartToCookies(state); // Clear cookies
    },
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
