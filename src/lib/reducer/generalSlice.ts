import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface CounterState {
  value: Record<string, any>;
}

const initialState: CounterState = {
  value: {},
};

export const generalSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    // set: (state) => {
    //   state.value += 1
    // },
    // decrement: (state) => {
    //   state.value -= 1
    // },
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload
    // },
  },
});

// Action creators are generated for each case reducer function
export const {} = generalSlice.actions;

const generalReducer = generalSlice.reducer;

export default generalReducer;
