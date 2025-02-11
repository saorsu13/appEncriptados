import { createSlice } from "@reduxjs/toolkit";

export interface ChangeCallbakState {
  callback: boolean;
}

const initialState: ChangeCallbakState = {
    callback: false
};

export const callbackSlice = createSlice({
  name: "callback",
  initialState,
  reducers: {    
    updateCallback: (state, action) => {
        state.callback = action.payload;
    },
  },
});

export const { updateCallback } = callbackSlice.actions;

export const callbackReducer = callbackSlice.reducer;