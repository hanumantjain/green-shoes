
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface UserState {
  firstName: string | null;
  userId: string | null;
}

const initialState: UserState = {
  firstName: Cookies.get('firstName') || null,
  userId: Cookies.get('userId') || null, 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ firstName: string; userId: string }>) {
      state.firstName = action.payload.firstName;
      state.userId = action.payload.userId;

      Cookies.set('firstName', action.payload.firstName);
      Cookies.set('userId', action.payload.userId);
    },
    clearUser(state) {
      state.firstName = null;
      state.userId = null;

      Cookies.remove('firstName');
      Cookies.remove('userId');
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
