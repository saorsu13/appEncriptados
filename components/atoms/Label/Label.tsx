import theme from "@/config/theme";
import { ThemeMode } from "@/context/theme";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import React from "react";
import { StyleSheet, Text, TextStyle } from "react-native";

type props = {
  label: string;
  variant?: "default" | "strong" | "semiBold" | "primary";
  customStyles?: TextStyle;
  fixWidth?: boolean;
};

const Label = ({
  label,
  variant = "default",
  customStyles,
  fixWidth,
}: props) => {
  const { themeMode } = useDarkModeTheme();
  const dynamicStyle =
    themeMode === ThemeMode.Dark
      ? { color: theme.lightMode.colors.actualBalance }
      : null;

  return (
    <Text
      allowFontScaling={false}
      style={
        !fixWidth
          ? [
              styles.defaultText,
              styles[`${variant}Text`],
              customStyles,
              dynamicStyle,
            ]
          : [
              styles.defaultText,
              styles[`${variant}Text`],
              customStyles,
              { width: "75%" },
            ]
      }
    >
      {label}
    </Text>
  );
};

export default Label;

const styles = StyleSheet.create({
  defaultText: {
    color: theme.colors.label,
    ...theme.textVariants.captionCard,
  },
  strongText: {
    fontFamily: "Inter_500Medium",
  },
  semiBoldText: {
    fontFamily: "Inter_600SemiBold",
  },
  primaryText: {
    fontFamily: "Inter_500Medium",
    color: theme.colors.mainAction,
  },
});
