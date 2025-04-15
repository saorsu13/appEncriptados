import { createSlice } from "@reduxjs/toolkit";
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
  idSim: string | number;
  simName: string;
  provider: string;
  iccid: string;
}

export const simSlice = createSlice({
  name: "sims",
  initialState,
  reducers: {
    addSim: (state, action) => {
      if (state.sims.find((item) => item.idSim === action.payload.idSim))
        return;

      state.sims = [...state.sims, action.payload];
    },
    setSimList: (state, action) => {
      state.sims = action.payload;
    },
    
    updateCurrentSim: (state, action) => {
      const sim = state.sims.find((item) => item.idSim === action.payload);
      if (!sim) return;

      state.currentSim = sim;
    },
    deleteSim: (state, action) => {
      state.sims = state.sims.filter((item) => item.idSim !== action.payload);
      if (!state.sims.length) {
        state.currentSim = null;
        return;
      }

      state.currentSim = state.sims[0];
    },
    deleteAllSims: (state) => {
      state.sims = [];
    },
    updateSimName: (state, action) => {
      const { idSim, newName } = action.payload;
      const sim = state.sims.find((item) => item.idSim === idSim);
      if (sim) {
        sim.simName = newName;
      }
    },
    resetSimState: (state) => {
      state.sims = [];
      state.currentSim = null;
    },    
  },
});

export const {
  addSim,
  updateCurrentSim,
  deleteSim,
  deleteAllSims,
  updateSimName,
  resetSimState,
  setSimList,
} = simSlice.actions;

export const simReducer = simSlice.reducer;
