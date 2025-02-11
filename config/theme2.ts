import { createTheme } from "@shopify/restyle";

export const palette = {
  white: "#F7F7F7",
  black: "#000000",
  lightGray: "#CCCCCC",
  darkGray: "#3E3E3E",
  primary: "#0AAEE1",
  secondary: "#35CDFB",
  primaryTextLight: "#001D26",
  primaryTextDark: "#F7F7F7",
  secondaryTextLight: "#60767D",
  secondaryTextDark: "#CCCCCC",
  backgroundLight: "#FFFFFF",
  backgroundDark: "#000000",
  backgroundSecondaryLight: "#E3F8FF",
  backgroundSecondaryDark: "#161616",
  backgroundAlternateLight: "#10B4E7",
  backgroundAlternateDark: "#222222",
  backgroundAlternate2Light: "#10B4E7",
  backgroundAlternate2Dark: "#032029",
  danger: "#CB0808",
  blueLight: "#CCEFFF",
  success: "#31BE0E",
};

export const customTheme = createTheme({
  colors: {
    primaryColor: palette.primary,

    secondaryColor: palette.secondary,
    primaryText: palette.primaryTextLight,
    secondaryText: palette.secondaryTextLight,
    background: palette.backgroundLight,
    backgroundSecondary: palette.backgroundSecondaryLight,
    backgroundAlternate: palette.backgroundAlternateLight,
    strokeBorder: palette.darkGray,
    backgroundAlternate2: palette.backgroundAlternate2Light,
    white: palette.white,
    neutro: palette.black,
    danger: palette.danger,
    blueLight: palette.blueLight,
    success: palette.success,
  },
  spacing: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
});

export const darkTheme = {
  ...customTheme,
  colors: {
    ...customTheme.colors,
    primaryColor: palette.primary,
    secondaryColor: palette.secondary,
    primaryText: palette.primaryTextDark,
    secondaryText: palette.secondaryTextDark,
    background: palette.backgroundDark,
    backgroundSecondary: palette.backgroundSecondaryDark,
    backgroundAlternate: palette.backgroundAlternateDark,
    strokeBorder: palette.darkGray,
    backgroundAlternate2: palette.backgroundAlternate2Dark,
    neutro: palette.white,
    danger: palette.danger,
    blueLight: palette.blueLight,
    success: palette.success,
  },
};

export type ThemeCustom = typeof customTheme;

export default customTheme;
