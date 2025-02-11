import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isActive: false,
};

const activePasswordRequiredSlice = createSlice({
  name: "activePasswordRequired",
  initialState,
  reducers: {
    enablePasswordRequired(state) {
      state.isActive = true;
    },
    disablePasswordRequired(state) {
      state.isActive = false;
    },
    togglePasswordRequired(state) {
      state.isActive = !state.isActive;
    },
  },
});

export const {
  enablePasswordRequired,
  disablePasswordRequired,
  togglePasswordRequired,
} = activePasswordRequiredSlice.actions;
export const activePasswordRequiredReducer =
  activePasswordRequiredSlice.reducer;
