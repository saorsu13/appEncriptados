import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isModalVisible: boolean;
}

const initialState: ModalState = {
  isModalVisible: false,
};

const modalPasswordRequiredSlice = createSlice({
  name: "modalPasswordRequired",
  initialState,
  reducers: {
    openModalRequired(state) {
      state.isModalVisible = true;
    },
    closeModalRequired(state) {
      state.isModalVisible = false;
    },
  },
});

export const { openModalRequired, closeModalRequired } =
  modalPasswordRequiredSlice.actions;
export const modalPasswordRequiredReducer = modalPasswordRequiredSlice.reducer;
