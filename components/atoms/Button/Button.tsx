import theme from "@/config/theme";
import React, { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type props = {
  variant?:
    | "primary"
    | "secondary"
    | "dark"
    | "delete"
    | "light"
    | "primaryPress"
    | "disabled";
  onClick: any;
  children: ReactNode;
  customStyles?: any;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
};

const Button = ({
  variant = "primary",
  children,
  onClick,
  customStyles,
  disabled = false,
  size = "medium",
}: props) => {
  const buttonSizeStyle = {
    small: styles.smallButton,
    medium: styles.mediumButton,
    large: styles.largeButton,
  }[size];

  return (
    <Pressable
      onPress={onClick}
      style={[
        styles.button,
        styles[variant],
        buttonSizeStyle,
        disabled ? styles.disabled : [],
      ]}
      disabled={disabled}
    >
      <Text
        allowFontScaling={false}
        style={[
          theme.textVariants.button,
          styles[variant],
          customStyles,
          disabled ? styles.textDisabled : [],
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    elevation: 2,
    width: "100%",
    minHeight: 56,

    ...theme.textVariants.button,
  },
  primary: {
    backgroundColor: theme.colors.mainAction,
    color: theme.colors.contrast,
  },
  primaryPress: {
    backgroundColor: theme.colors.mainActionState,
    color: theme.colors.contrast,
  },
  secondary: {
    backgroundColor: theme.colors.placeholderLight,
    color: theme.colors.contentSummary,
  },
  dark: {
    backgroundColor: theme.colors.darkBlack,
    color: theme.colors.darkGray,
    fontFamily: "Inter_400Regular",
  },
  delete: {
    backgroundColor: theme.colors.deleteBackground,
    color: theme.colors.contrast,
  },
  light: {
    backgroundColor: theme.colors.contrast,
    color: theme.colors.mainText,
  },
  disabled: {
    opacity: 0.4,
  },
  textDisabled: {
    backgroundColor: "transparent",
  },

  smallButton: {
    borderRadius: 8,

    minHeight: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  mediumButton: {
    minHeight: 56,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  largeButton: {
    minHeight: 72,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
});

export default Button;
