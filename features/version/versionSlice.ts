import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Definición de interfaces
export interface VersionState {
  currentVersion: string;
  hasShownModal: boolean;
}

const initialState: VersionState = {
  currentVersion: "1.0.0",
  hasShownModal: false, // Estado inicial para controlar si el modal ha sido mostrado
};

export const versionSlice = createSlice({
  name: "version",
  initialState,
  reducers: {
    setVersion: (state, action: PayloadAction<string>) => {
      state.currentVersion = action.payload;
    },
    setHasShownModal: (state, action: PayloadAction<boolean>) => {
      state.hasShownModal = action.payload;
    },
  },
});

export const { setVersion, setHasShownModal } = versionSlice.actions;

export const versionReducer = versionSlice.reducer;
