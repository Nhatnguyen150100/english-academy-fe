import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../types/user.types';

const initialState: IUser = {
  _id: '',
  email: '',
  name: '',
  role: 'USER',
  phone_number: '',
  score: 0,
  accountType: 'FREE',
  address: '',
  __v: 0,
  createdAt: '',
  updatedAt: ''
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state = { ...action.payload };
      return state;
    },
    clearUser: (state) => {
      state = { ...initialState };
      return state;
    }
  },
});

export const { setUser, clearUser } = userSlice.actions;

const userReducer = userSlice.reducer;

export default userReducer;
