// CartSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';
import Cookies from 'js-cookie';

interface CartItem {
  product_id: string;
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
  loading: boolean;
  error: string | null;
}

// Utility to get guest cart from localStorage
const getGuestCart = (): CartItem[] => {
  const guestCart = localStorage.getItem('guestCart');
  return guestCart ? JSON.parse(guestCart) : [];
};

// Utility to set guest cart in localStorage
const setGuestCart = (cart: CartItem[]) => {
  localStorage.setItem('guestCart', JSON.stringify(cart));
};

// Get the user_id from cookies
const getUserId = (): string | null => {
  return Cookies.get('userId') || null; // Retrieve user_id from cookies
};

// Async thunk to fetch cart items from the server
export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async () => {
  const userId = getUserId();

  if (!userId) {
    throw new Error('User not logged in');
  }

  if (userId === 'guest') {
    // For guest user, get cart items from localStorage
    return getGuestCart();
  }

  const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL;
  const response = await fetch(`${backendBaseUrl}/getCart?user_id=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch cart items');
  }

  const data = await response.json();
  return data.cartItems.map((item: any) => ({
    product_id: item.product_id,
    id: item.product_id,
    name: item.product_name,
    image: item.product_image,
    size: item.size,
    price: item.price,
    quantity: item.quantity,
  }));
});

// Async thunk to update the cart item quantity in the backend
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async (
    payload: { productId: string; size: number; quantity: number },
    { getState }
  ) => {
    const { userId } = (getState() as RootState).user;

    if (!userId) {
      throw new Error('User not logged in');
    }

    if (userId === 'guest') {
      // Handle guest cart in localStorage
      let guestCart = getGuestCart();

      if (payload.quantity === 0) {
        // Remove item from guest cart
        guestCart = guestCart.filter(
          item => !(item.id === payload.productId && item.size === payload.size)
        );
      } else {
        const existingItem = guestCart.find(
          item => item.id === payload.productId && item.size === payload.size
        );

        if (existingItem) {
          existingItem.quantity = payload.quantity;
        } else {
          guestCart.push({
            product_id: payload.productId,
            id: payload.productId,
            name: 'Unknown Product', // Replace with product name if available
            image: '', // Replace with product image if available
            size: payload.size,
            price: 0, // Replace with product price if available
            quantity: payload.quantity,
          });
        }
      }

      setGuestCart(guestCart);

      return { productId: payload.productId, size: payload.size, quantity: payload.quantity };
    }
    const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL;

    // For logged-in users, make a server request
    if (payload.quantity === 0) {
      await axios.post(`${backendBaseUrl}/removeCartItem`, {
        user_id: userId,
        product_id: payload.productId,
        size: payload.size,
      });
      return { productId: payload.productId, size: payload.size, quantity: 0 };
    } else {
      await axios.post(`${backendBaseUrl}/updateCart`, {
        user_id: userId,
        product_id: payload.productId,
        size: payload.size,
        quantity: payload.quantity,
      });
      return { productId: payload.productId, size: payload.size, quantity: payload.quantity };
    }
  }
);

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === newItem.id && item.size === newItem.size
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push(newItem);
      }

      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    removeItem(state, action: PayloadAction<string>) {
      const id = action.payload;
      const itemToRemove = state.items.find((item) => item.id === id);

      if (itemToRemove) {
        state.items = state.items.filter((item) => item.id !== id);
      }

      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    clearCart(state) {
      state.items = [];
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart items';
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const { productId, size, quantity } = action.payload;
        if (quantity === 0) {
          state.items = state.items.filter(item => item.id !== productId || item.size !== size);
        } else {
          const item = state.items.find(item => item.id === productId && item.size === size);
          if (item) {
            item.quantity = quantity;
          }
        }
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      });
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
