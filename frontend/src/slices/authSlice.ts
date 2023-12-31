import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo') as string)
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction) {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout(state) {
      state.userInfo = null;
      localStorage.clear();
    },
  },
});

export default authSlice.reducer;
export const { setCredentials, logout } = authSlice.actions;
