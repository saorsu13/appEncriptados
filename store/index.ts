import { countryReducer } from "@/features/country/countrySlice";
import { simReducer } from "@/features/sims/simSlice";
import { substituteReducer } from "@/features/substitute/substituteSlice";
import { voiceReducer } from "@/features/voice/voiceSlice";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { networkReducer } from "@/features/network-profile/networkProfileSlice";
import { callbackReducer } from "@/features/callback/callbackSlice";
import {
  modalResetStateReducer,
  settingsReducer,
} from "@/features/settings/settingsSlice";
import { loadingReducer } from "@/features/loading/loadingSlice";
import { insufficientFundsReducer } from "@/features/balance/insufficientFundsSlice";
import { balanceReducer } from "@/features/balance/balanceSlice";

import { menuCurrentProductReducer } from "@/features/menuCurrentProduct/menuCurrentProductSlice";
import { activePasswordRequiredReducer } from "@/features/activePasswordRequired/activePasswordRequiredSlice";
import { currencyReducer } from "@/features/currentCurrency/currencySlice";
import { modalPasswordRequiredReducer } from "@/features/modalPasswordRequired/modalPasswordRequiredSlice";
import { versionReducer } from "@/features/version/versionSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: [
    "sims",
    "country",
    "substitute",
    "networkProfile",
    "callback",
    "settings",
    "balance",
    "insufficientFunds",
    "currentProductSelected",
    "activePasswordRequired",
    "currency",
    "modalPasswordRequired",
    "voiceFilter",
    "modalReset",
  ],
  blacklist: ["loading", "modalReducer", "version"],
};

const combinedReducer = combineReducers({
  sims: simReducer,
  country: countryReducer,
  substitute: substituteReducer,
  voiceFilter: voiceReducer,
  networkProfile: networkReducer,
  callback: callbackReducer,
  settings: settingsReducer,
  loading: loadingReducer,
  balance: balanceReducer,
  insufficientFunds: insufficientFundsReducer,
  menuCurrentProduct: menuCurrentProductReducer,
  activePasswordRequired: activePasswordRequiredReducer,
  currency: currencyReducer,
  modalPasswordRequired: modalPasswordRequiredReducer,
  modalReset: modalResetStateReducer,
  version: versionReducer,
});

const persistedReducer = persistReducer(persistConfig, combinedReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["register", "rehydrate"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
