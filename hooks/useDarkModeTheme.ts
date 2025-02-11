import { DarkModeContext } from "@/context/theme";
import { useContext } from "react";

export const useDarkModeTheme = () => {
  const context = useContext(DarkModeContext);

  return context;
};
