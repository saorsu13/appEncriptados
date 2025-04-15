import { createSlice, PayloadAction  } from "@reduxjs/toolkit";
import { Sim } from "./types";

export interface SimState {
  sims: Sim[];
  currentSim: Sim | null;
}

const initialState: SimState = {
  sims: [],
  currentSim: null,
};

export interface Sim {
  idSim: string ;
  simName: string;
  provider: string;
  iccid: string;
}

export const simSlice = createSlice({
  name: "sims",
  initialState,
  reducers: {
    addSim: (state, action: PayloadAction<Sim>) => {
      if (!state.sims.find((item) => item.idSim === action.payload.idSim)) {
        state.sims.push(action.payload);
      }
    },
    updateCurrentSim: (state, action: PayloadAction<string>) => {
      const sim = state.sims.find((item) => item.idSim === action.payload);
      if (sim) {
        state.currentSim = sim;
      }
    },
    deleteSim: (state, action: PayloadAction<string>) => {
      state.sims = state.sims.filter((item) => item.idSim !== action.payload);
      if (state.currentSim?.idSim === action.payload) {
        state.currentSim = state.sims.length ? state.sims[0] : null;
      }
    },
    deleteAllSims: (state) => {
      state.sims = [];
      state.currentSim = null;
    },
    resetSimState: (state) => {
      state.sims = [];
      state.currentSim = null;
    },
    setSims: (state, action: PayloadAction<Sim[]>) => {
      state.sims = action.payload;
      state.currentSim = action.payload.length ? action.payload[0] : null;
    },
  },
});

export const {
  addSim,
  updateCurrentSim,
  deleteSim,
  deleteAllSims,
  resetSimState,
  setSims,
} = simSlice.actions;

export const simReducer = simSlice.reducer;
