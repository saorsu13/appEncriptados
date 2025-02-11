import { createSlice } from "@reduxjs/toolkit";
import { getLocales } from "expo-localization";

// Definición de interfaces
export interface SettingsState {
  lang: string;
}

export interface ModalResetState {
  modalReset: boolean;
}

const initialState: SettingsState = {
  lang: getLocales()[0]?.languageCode || "es",
};

const initialModalResetState: ModalResetState = {
  modalReset: false,
};

export const modalResetStateSlice = createSlice({
  name: "modalResetState",
  initialState: initialModalResetState,
  reducers: {
    resetModalUpdate: (state, action) => {
      state.modalReset = action.payload;
    },
  },
});

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateLanguage: (state, action) => {
      state.lang = action.payload;
    },
  },
});

export const { resetModalUpdate } = modalResetStateSlice.actions;
export const { updateLanguage } = settingsSlice.actions;

export const modalResetStateReducer = modalResetStateSlice.reducer;
export const settingsReducer = settingsSlice.reducer;
