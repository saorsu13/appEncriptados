import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../config/api";
import { UserInfo } from "@/features/sign-in/types";
import { useDispatch } from "react-redux";
import { addSim, updateCurrentSim } from "@/features/sims/simSlice";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import { listSubscriber } from "@/api/subscriberApi";
import { getDeviceUUID } from "../utils/getUUID";
import { setSims } from "@/features/sims/simSlice";
import { resetModalUpdate } from "@/features/settings/settingsSlice";


export const MIN_PASSWORD_LENGTH = 10;
const ALWAYS_REQUIRE_LOGIN = false;

export type User = {
  simName: string;
  idSim: string;
  iccid: string;
  code: number;
  provider?: string;
} & Partial<UserInfo>;

export type ProviderPlan = {
  name: string;
  pckdatabyte: string;
  useddatabyte: string;
  format: string;
};

export type ProviderType = {
  provider: string;
  iccid: string;
  imsi: string;
  plans: ProviderPlan[];
};

export type AuthContextType = {
  signIn: (user: User, providers?: ProviderType[], balance?: string) => void;
  signOut: () => void;
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  getSignInRoute: () => any;
  providers: ProviderType[];
  setProviders: (providers: ProviderType[]) => void;
  balance: string | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

const storeUser = async (user: User, balance: string | null) => {
  try {
    console.log("💾 [storeUser] Guardando user en AsyncStorage:", user);
    await AsyncStorage.setItem("@user", JSON.stringify(user));
    await AsyncStorage.setItem("@balance", balance ?? "");
  } catch (e) {
    console.error("Failed to save the data to the storage", e);
  }
};

const deleteUser = async () => {
  try {
    console.log("🧹 [deleteUser] Borrando datos del usuario de AsyncStorage");
    await AsyncStorage.removeItem("@user");
    await AsyncStorage.removeItem("@balance");
  } catch (e) {
    console.error("Failed to delete the data from storage", e);
  }
};

export const loadUser = async (): Promise<{ user: User | null; balance: string | null }> => {
  try {
    const userString = await AsyncStorage.getItem("@user");
    const balance = await AsyncStorage.getItem("@balance");

    if (userString) {
      const user = JSON.parse(userString);
      console.log("🔄 [loadUser] Restaurando sesión desde AsyncStorage:", user);

      if (user?.provider === "tottoli") {
        console.warn("🟡 [loadUser] Usuario tottoli detectado (no se borra, se maneja aparte)");
        return { user, balance };
      }

    }
    console.log("📡 [loadUser] Intentando restaurar usuario desde backend...");
    const uuid = await getDeviceUUID();
    const sims = await listSubscriber(uuid);

    if (!Array.isArray(sims) || sims.length === 0 || sims?.code === "not_found") {
      console.warn("📭 [loadUser] No hay SIMs asociadas al UUID. Borrando sesión.");
      return { user: null, balance: null };
    }

    const restoredUser: User = {
      simName: sims[0].name,
      idSim: sims[0].iccid,
      iccid: sims[0].iccid,
      code: 0,
      provider: sims[0].provider,
    };

    console.log("♻️ [loadUser] Restaurando sesión fallback con SIM:", restoredUser);
    return { user: restoredUser, balance: "" };
  } catch (e) {
    console.error("❌ [loadUser] Error al restaurar sesión:", e);
    return { user: null, balance: null };
  }
};

export function AuthProvider({
  children,
  userPromise,
  onLoaded,
}: {
  children: ReactNode;
  userPromise: Promise<{ user: User | null; balance: string | null }>;
  onLoaded: () => void;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [providers, setProviders] = useState<ProviderType[]>([]);
  const [balance, setBalance] = useState<string | null>(null);

  const getSignInRoute = () => "/sign-in/";
  const dispatch = useDispatch();

  const modalRequiredPassword = useAppSelector(
    (state) => state.modalPasswordRequired.isModalVisible
  );

  useEffect(() => {
    userPromise.then(async ({ user, balance }) => {
      if (user && user.idSim) {
        const uuid = await getDeviceUUID();
        const raw = await listSubscriber(uuid);
        const parsed = raw.map(sim => ({
          idSim: sim.iccid,
          simName: sim.name ?? sim.iccid,
          provider: sim.provider,
          code: sim.id ?? 0,
          iccid: sim.iccid, 
        }));
        dispatch(setSims(parsed));

        dispatch(updateCurrentSim(user.idSim));

        await storeUser(user, balance);
        setUser(user);
        setBalance(balance);
        setIsLoggedIn(true);
        console.log("📲 [AuthProvider] Agregando SIM al store:", user);
      } else {
        console.warn("🚫 [AuthProvider] Usuario no válido. Reiniciando estado.");
        setUser(null);
        setBalance(null);
        setIsLoggedIn(false);
      }
      setIsLoading(false);
      onLoaded();
    });
  }, []);


  return (
    <AuthContext.Provider
      value={{
        signIn: (
          user: User,
          newProviders: ProviderType[] = [],
          userBalance?: string
        ) => {
          console.log("🔐 [signIn] Usuario iniciando sesión:", user.simName);
          setBalance(userBalance ?? null);
          setUser(user);
          setProviders(newProviders);
          dispatch(addSim({
            idSim: user.idSim,    
            simName: user.simName,
            provider: user.provider ?? "unknown",
            iccid: user.iccid,
            code: user.code,
          }));
          dispatch(updateCurrentSim(user.iccid));  
          AsyncStorage.setItem("currentICCID", user.iccid);
          storeUser(user, userBalance);
          setIsLoggedIn(true);
        },

        signOut: () => {
          console.log("🚪 [signOut] Cierre de sesión ejecutado");
          setUser(null);
          setIsLoggedIn(false);
          setProviders([]);
          setBalance(null);
          deleteUser();
          dispatch(resetModalUpdate(false));
        },
        user,
        isLoggedIn,
        isLoading,
        getSignInRoute,
        providers,
        setProviders,
        balance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}