import { createSlice } from "@reduxjs/toolkit";

export interface voiceState {  
  filter: number;  
}

const initialState: voiceState = {
  filter: 0
};

export const voiceSlice = createSlice({
  name: "voiceFilter",
  initialState,
  reducers: {
    updateVoice: (state, action) => {      
      state.filter = action.payload;      
    },
  },
});

export const { updateVoice } = voiceSlice.actions;

export const voiceReducer = voiceSlice.reducer;
