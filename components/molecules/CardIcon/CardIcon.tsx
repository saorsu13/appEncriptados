import theme from "@/config/theme";
import { ThemeMode } from "@/context/theme";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

type props = {
  children: ReactNode;
  mode?: string;
};

const CardIcon = ({ children, mode }: props) => {
  const { themeMode } = useDarkModeTheme();
  return (
    <View
      style={[
        themeMode === ThemeMode.Dark
          ? styles.container
          : {
              ...styles.container,
              backgroundColor: theme.lightMode.colors.blueDark,
            },
      ]}
    >
      {children}
    </View>
  );
};

export default CardIcon;

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.mainBackground,
    borderRadius: 14,
    width: 100,
  },
  dark: {
    backgroundColor: "#272727",
  },

  light: {
    backgroundColor: theme.lightMode.colors.blueDark,
  },
});
