import { createSlice } from "@reduxjs/toolkit";

export interface NetworkProfileState {
  networkProfile: string;
  recommendedNetwork: string;
}

const initialState: NetworkProfileState = {
    networkProfile: "r1",
    recommendedNetwork: "r2"
};

export const networkSlice = createSlice({
  name: "networkProfile",
  initialState,
  reducers: {    
    updateRecommendedNetwork: (state, action) => {
      state.recommendedNetwork = action.payload;
    },
    updateCurrentNetwork: (state, action) => {
      state.networkProfile = action.payload;
    },
  },
});

export const { updateCurrentNetwork, updateRecommendedNetwork } = networkSlice.actions;

export const networkReducer = networkSlice.reducer;