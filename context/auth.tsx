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
// Set this to true to require remembered users to enter their password.
const ALWAYS_REQUIRE_LOGIN = true;

export type User = {
  simName: string;
  idSim: number;
  code: number;
} & Partial<UserInfo>;

const AuthContext = createContext<{
  signIn: (user: User) => void;
  signOut: () => void;
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  getSignInRoute: () => any;
} | null>(null);

// This hook can be used to access the user info.
export function useAuth() {
  return useContext(AuthContext);
}

const storeUser = async (user: User) => {
  try {
    await AsyncStorage.setItem("@user", JSON.stringify(user));
  } catch (e) {
    console.error("Failed to save the data to the storage", e);
  }
};

const deleteUser = async () => {
  try {
    await AsyncStorage.removeItem("@user");
  } catch (e) {
    console.error("Failed to save the data to the storage", e);
  }
};

export const loadUser = async (): Promise<User | null> => {
  try {
    const storedUser = await AsyncStorage.getItem("@user");

    return storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {
    console.error("Failed to save the data to the storage", e);
  }
  return null;
};

export function AuthProvider({
  children,
  userPromise,
  onLoaded,
}: {
  children: ReactNode;
  userPromise: Promise<User | null>;
  onLoaded: () => void;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const getSignInRoute = () => "/sign-in/";
  const dispatch = useDispatch();

  const modalRequiredPassword = useAppSelector((state) => {
    return state.modalPasswordRequired.isModalVisible;
  });

  useEffect(() => {
    userPromise.then(async (user) => {
      if (user) {
        setUser(user);

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
        signIn: (user: User) => {
          setUser(user);
          setIsLoggedIn(true);
          dispatch(addSim(user));
          dispatch(updateCurrentSim(user.idSim));
          storeUser(user);
        },
        signOut: () => {
          setUser(null);
          setIsLoggedIn(false);
          deleteUser();
        },
        user: user,
        isLoggedIn,
        isLoading,
        getSignInRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
