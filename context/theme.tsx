import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export enum ThemeMode {
  Light = "light",
  Dark = "dark",
}

interface DarkModeContextType {
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
}

export const DarkModeContext = createContext<DarkModeContextType>({
  themeMode: ThemeMode.Light,
  toggleThemeMode: () => {},
});

interface DarkModeProviderProps {
  children: ReactNode;
}

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({
  children,
}) => {
  const [themeMode, setThemeMode] = useState(ThemeMode.Dark);

  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem("themeMode");
        if (savedThemeMode) {
          setThemeMode(savedThemeMode as ThemeMode);
        }
      } catch (error) {
        error;
      }
    };

    loadThemeMode();
  }, []);

  const toggleThemeMode = () => {
    const newThemeMode =
      themeMode === ThemeMode.Light ? ThemeMode.Dark : ThemeMode.Light;
    setThemeMode(newThemeMode);

    AsyncStorage.setItem("themeMode", newThemeMode)
      .then((ok) => ok)
      .catch((error) => error);
  };

  return (
    <DarkModeContext.Provider value={{ themeMode, toggleThemeMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

//THIS COMPONENT WILL BE ELIMINATED BECAUSE WE ONLY NEED ONE THEME PROVIDER
