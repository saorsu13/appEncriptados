import { createSlice } from "@reduxjs/toolkit";

export interface countryState {
  countryCode: string;
}

const initialState: countryState = {
  countryCode: "",
};

export const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    updateCurrentCountry: (state, action) => {
      if (!action.payload || action.payload.length <= 0) return;

      state.countryCode = action.payload;
    },

    clearCurrentCountry: (state) => {
      state.countryCode = null;
    },
  },
});

export const { updateCurrentCountry, clearCurrentCountry } =
  countrySlice.actions;

export const countryReducer = countrySlice.reducer;
