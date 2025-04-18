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
import { useDeviceUUID } from "@/hooks/useDeviceUUID";
import { getDeviceUUID } from "../utils/getUUID";


export const MIN_PASSWORD_LENGTH = 10;
const ALWAYS_REQUIRE_LOGIN = false;

export type User = {
  simName: string;
  idSim: number;
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
    await AsyncStorage.setItem("@user", JSON.stringify(user));
    await AsyncStorage.setItem("@balance", balance ?? "");
  } catch (e) {
    console.error("Failed to save the data to the storage", e);
  }
};

const deleteUser = async () => {
  try {
    await AsyncStorage.removeItem("@user");
    await AsyncStorage.removeItem("@balance");
  } catch (e) {
    console.error("Failed to delete the data from storage", e);
  }
};

export const loadUser = async (): Promise<{ user: User | null; balance: string | null }> => {
  try {
    const uuid = await getDeviceUUID();
    const sims = await listSubscriber(uuid);

    if (!Array.isArray(sims) || sims.length === 0 || sims?.code === "not_found") {
      console.warn("📭 No hay SIMs asociadas al UUID. Borrando sesión.");
      await AsyncStorage.removeItem("@user");
      await AsyncStorage.removeItem("@balance");
      return { user: null, balance: null };
    }

    const restoredUser: User = {
      simName: sims[0].name,
      idSim: Number(sims[0].iccid),
      code: 0,
      provider: sims[0].provider,
    };

    await AsyncStorage.setItem("@user", JSON.stringify(restoredUser));
    await AsyncStorage.setItem("@balance", "");

    return { user: restoredUser, balance: "" };
  } catch (e) {
    console.error("❌ Error al restaurar sesión:", e);
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
    userPromise.then(({ user, balance }) => {
      if (user && user.idSim) {
        setUser(user);
        setBalance(balance);
        dispatch(addSim(user));
        dispatch(updateCurrentSim(user.idSim));
        if (!modalRequiredPassword) {
          setIsLoggedIn(true);
        }
      } else {
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
          setBalance(userBalance ?? null);
          setUser(user);
          setProviders(newProviders);
          dispatch(addSim(user));
          dispatch(updateCurrentSim(user.idSim));
          storeUser(user, userBalance);
          setIsLoggedIn(true);
        },
        signOut: () => {
          setUser(null);
          setIsLoggedIn(false);
          setProviders([]);
          setBalance(null);
          deleteUser();
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