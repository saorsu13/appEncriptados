import { createSlice } from "@reduxjs/toolkit";

export interface substituteState {
  mode: string;
  countryCode: number | null;
  countryPhoneCode: number | null;
  phoneNumber: number | null;
}

const initialState: substituteState = {
  mode: "dynamic",
  countryCode: null,
  countryPhoneCode: null,
  phoneNumber: null
};

export const substituteSlice = createSlice({
  name: "substitute",
  initialState,
  reducers: {
    updateSubstitute: (state, action) => {      
      state.mode = action.payload.mode;
      state.countryCode = action.payload.countryCode;
      state.countryPhoneCode = action.payload.countryPhoneCode;
      state.phoneNumber = action.payload.mode == "manual" ? action.payload.phoneNumber: null;              
    },
  },
});

export const { updateSubstitute } = substituteSlice.actions;

export const substituteReducer = substituteSlice.reducer;
