import { createSlice } from "@reduxjs/toolkit";

export interface InsufficientFundsState {
  hasInsufficientFunds: boolean;
}

const initialState: InsufficientFundsState = {
  hasInsufficientFunds: false,
};

export const insufficientFundsSlice = createSlice({
  name: "insufficientFunds",
  initialState,
  reducers: {
    setInsufficientFunds: (state, action) => {
      state.hasInsufficientFunds = action.payload;
    },
  },
});

export const { setInsufficientFunds } = insufficientFundsSlice.actions;

export const insufficientFundsReducer = insufficientFundsSlice.reducer;
