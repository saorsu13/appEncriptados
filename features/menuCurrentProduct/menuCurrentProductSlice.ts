import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const SECTIONS = {
  SIM: "sim",
  APPLICATION: "application",
  PHONE: "phone",
} as const;

type SectionType = (typeof SECTIONS)[keyof typeof SECTIONS];

interface ProductState {
  currentProduct: SectionType;
}

const initialState: ProductState = {
  currentProduct: SECTIONS.APPLICATION,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProduct(state, action: PayloadAction<SectionType>) {
      state.currentProduct = action.payload;
    },
  },
});

export const { setProduct } = productSlice.actions;
export const menuCurrentProductReducer = productSlice.reducer;
