import { createSlice } from "@reduxjs/toolkit";

export interface CurrencyState {
  currency: string;
}

const initialState: CurrencyState = {
  currency: "USD",
};

export const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
  },
});

export const { setCurrency } = currencySlice.actions;

export const currencyReducer = currencySlice.reducer;
