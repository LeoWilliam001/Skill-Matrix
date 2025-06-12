import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type AuthState, type User } from '../types/auth';

const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

const initialState: AuthState = {
  isLoggedIn: !!token,
  token,
  user: user ? JSON.parse(user) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);      
      localStorage.setItem('user', JSON.stringify(action.payload.user)); 
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = '';
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
