import customTheme, { darkTheme } from "@/config/theme2";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeProvider } from "@shopify/restyle";
import React from "react";
import { ThemeMode } from "./theme";

const ThemeProviderComponent = ({ children }) => {
  const { themeMode } = useDarkModeTheme();

  let selectedTheme;
  switch (themeMode) {
    case ThemeMode.Dark:
      selectedTheme = darkTheme;
      break;

    case ThemeMode.Light:
      selectedTheme = customTheme;
      break;
    default:
      selectedTheme = customTheme;
      break;
  }

  return <ThemeProvider theme={selectedTheme}>{children}</ThemeProvider>;
};

export default ThemeProviderComponent;
