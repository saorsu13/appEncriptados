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

export const MIN_PASSWORD_LENGTH = 10;
const ALWAYS_REQUIRE_LOGIN = true;

export type User = {
  simName: string;
  idSim: number;
  code: number;
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
  } catch (e) {
    console.error("Failed to delete the data from storage", e);
  }
};

export const loadUser = async (): Promise<{ user: User | null, balance: string | null }> => {
  try {
    const storedUser = await AsyncStorage.getItem("@user");
    const storedBalance = await AsyncStorage.getItem("@balance");
    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      balance: storedBalance ?? null,
    };
  } catch (e) {
    console.error("Failed to load the data from storage", e);
  }
  return { user: null, balance: null };
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
      if (user && user.idSim && user.code) {
        setUser(user);
        setBalance(balance);
        if (!modalRequiredPassword) {
          setIsLoggedIn(true);
        }
      }
      setIsLoading(false);
      onLoaded();
    });
  }, []);
  

  return (
    <AuthContext.Provider
      value={{
        signIn: (user: User, newProviders: ProviderType[] = [],  userBalance?: string) => {

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
