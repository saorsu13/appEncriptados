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
  name?: string;
  provider: string;
  iccid: string;
  code?: string;
}

export const simSlice = createSlice({
  name: "sims",
  initialState,
  reducers: {
    addSim: (state, action: PayloadAction<Sim>) => {
      console.log("🟢 [addSim] Recibido:", action.payload);
      if (!state.sims.find((item) => item.idSim === action.payload.idSim)) {
        state.sims.push(action.payload);
        console.log("✅ [addSim] SIM agregada:", action.payload.idSim);
      } else {
        console.log("⚠️ [addSim] SIM ya existe, no se agregó:", action.payload.idSim);
      }
    },
    updateCurrentSim: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      console.log("🔄 [updateCurrentSim] Buscando SIM con idSim o iccid:", id);
      const sim = state.sims.find((item) =>
        String(item.idSim) === id || String(item.iccid) === id
      );
      if (sim) {
        state.currentSim = sim;
        console.log("✅ [updateCurrentSim] SIM actualizada:", sim);
      } else {
        console.warn("❌ [updateCurrentSim] SIM no encontrada:", id);
      }
    },
    updateSimName: (state, action: PayloadAction<{ idSim: string; newName: string }>) => {
      const { idSim, newName } = action.payload;
      const sim = state.sims.find((s) => s.idSim === idSim);
      if (sim) {
        console.log(`✏️ [updateSimName] Actualizando nombre de SIM ${idSim} a '${newName}'`);
        sim.simName = newName;
      }
      if (state.currentSim?.idSim === idSim) {
        state.currentSim.simName = newName;
        console.log(`✏️ [updateSimName] También se actualizó el nombre de la SIM actual`);
      }
    },
    deleteSim: (state, action: PayloadAction<string>) => {
      console.log("🗑️ [deleteSim] Eliminando SIM con idSim:", action.payload);
      state.sims = state.sims.filter((item) => item.idSim !== action.payload);
      if (state.currentSim?.idSim === action.payload) {
        state.currentSim = state.sims.length ? state.sims[0] : null;
        console.log("⚠️ [deleteSim] SIM eliminada era la actual. Nueva actual:", state.currentSim);
      }
    },
    deleteAllSims: (state) => {
      console.log("💣 [deleteAllSims] Todas las SIMs fueron eliminadas");
      state.sims = [];
      state.currentSim = null;
    },
    resetSimState: (state) => {
      console.log("🔄 [resetSimState] Estado reseteado");
      state.sims = [];
      state.currentSim = null;
    },
    setSims: (state, action: PayloadAction<Sim[]>) => {
      console.log("📦 [setSims] Estableciendo SIMs:", action.payload);
      const newSims = action.payload;
      const prevCurrentId = state.currentSim?.idSim;

      state.sims = newSims;
    
      const stillExists = newSims.find((sim) => sim.idSim === prevCurrentId);
      
      if (!stillExists) {
        state.currentSim = newSims.length ? newSims[0] : null;
        console.log("📍 [setSims] currentSim no válido, se asignó nueva SIM:", state.currentSim);
      } else {
        console.log("🔒 [setSims] currentSim conservado:", state.currentSim);
      }
    },
    
  },
});


export const {
  addSim,
  updateCurrentSim,
  updateSimName,
  deleteSim,
  deleteAllSims,
  resetSimState,
  setSims,
} = simSlice.actions;

export const simReducer = simSlice.reducer;
