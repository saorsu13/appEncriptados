import theme from "@/config/theme";
import { ThemeMode } from "@/context/theme";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { color } from "@shopify/restyle";
import { FormikErrors } from "formik";
import React, { ReactNode, forwardRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInputProps,
} from "react-native";

type props = {
  label?: string;
  suffixIcon?: ReactNode;
  prefixIcon?: ReactNode;
  error?: string | FormikErrors<any> | string[] | FormikErrors<any>[];
  onChangeText: (text: string) => void;
  value: string;
  variant?: "default" | "light";
  required?: boolean;
  placeholder?: string;
  onBlur?: (any) => any;
  inputMode?: "text" | "numeric";
  maxLength?: number;
  editable?: boolean;
  status?: string | null;
  statusMessage?: string | null | any;
  onPressIcon?: () => void;
} & TextInputProps;

const InputField = forwardRef<TextInput, props>(({
  label,
  onChangeText,
  editable,
  value,
  error,
  suffixIcon,
  prefixIcon,
  variant = "default",
  required = false,
  placeholder,
  onBlur,
  inputMode = "text",
  maxLength,
  status = null,
  statusMessage = null,
  onPressIcon,
  ...rest
}, ref) => {
  const onChangeValue = (value: string) => {
    if (inputMode === "numeric") {
      onChangeText(value.replace(/[^0-9]/g, ""));
      return;
    }
    onChangeText(value);
  };

  const { themeMode } = useDarkModeTheme();

  return (
    <View style={styles.container}>
      {label && (
        <Text
          allowFontScaling={false}
          style={{ ...styles.defaultLabel, ...styles[`${variant}Label`] }}
        >
          {required && (
            <Text allowFontScaling={false} style={styles.required}>
              *
            </Text>
          )}
          {label}
        </Text>
      )}
      <View style={styles.containerInput}>
        {prefixIcon && (
          <View
            style={{ ...styles.prefixIcon, left: variant === "light" ? 15 : 10 }}
          >
            {prefixIcon}
          </View>
        )}
        <TextInput
          ref={ref}
          allowFontScaling={false}
          autoCapitalize="none"
          editable={editable}
          onChangeText={onChangeValue}
          onBlur={onBlur}
          value={value}
          style={[
            themeMode === ThemeMode.Dark
              ? styles.defaultInput
              : { ...styles.defaultInput, color: theme.colors.darkBlack },
            themeMode === ThemeMode.Dark
              ? {
                  ...styles[`${variant}Input`],
                  borderColor: error
                    ? theme.colors.deleteBackground
                    : status === "success"
                    ? theme.colors.inputStatusSuccess
                    : theme.colors.borderInput,
                  backgroundColor:
                    status === "success"
                      ? theme.colors.inputStatusSuccessBG
                      : styles.defaultInput.backgroundColor,
                  paddingLeft: prefixIcon ? 50 : 14,
                  paddingRight: suffixIcon ? 50 : 14,
                }
              : {
                  borderColor: error
                    ? theme.colors.deleteBackground
                    : status === "success"
                    ? theme.colors.inputStatusSuccess
                    : theme.colors.borderInput,
                  backgroundColor:
                    themeMode === ThemeMode.Light
                      ? "white"
                      : styles.defaultInput.backgroundColor,
                  paddingLeft: prefixIcon ? 50 : 14,
                  paddingRight: suffixIcon ? 50 : 14,
                },
            {
              opacity: editable ? 0.5 : 1,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={styles.defaultPlaceholder.color}
          inputMode={inputMode}
          maxLength={maxLength}
          {...rest}
        />
        {suffixIcon && (
          <TouchableOpacity style={styles.suffixIcon} onPress={onPressIcon}>
            {suffixIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text allowFontScaling={false} style={styles.defaultError}>
          {typeof error !== "string" ? error[0] : error}
        </Text>
      )}
      {status === "success" && statusMessage && (
        <Text allowFontScaling={false} style={styles.statusSucess}>
          {typeof statusMessage !== "string" ? statusMessage[0] : statusMessage}
        </Text>
      )}
      {status === "info" && statusMessage && (
        <Text allowFontScaling={false} style={styles.statusInfo}>
          {typeof statusMessage !== "string" ? statusMessage[0] : statusMessage}
        </Text>
      )}
    </View>
  );
});

export default InputField;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  defaultInput: {
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: theme.colors.complementaryText,
    color: theme.colors.smootText,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...theme.textVariants.input,
  },
  defaultPlaceholder: { color: theme.colors.labelText },
  defaultLabel: {
    color: theme.colors.labelText,
    paddingLeft: 3,
    ...theme.textVariants.descriptionCard,
  },
  defaultError: {
    textAlign: "right",
    color: theme.colors.deleteBackground,
    ...theme.textVariants.descriptionCard,
  },
  lightLabel: {
    color: theme.colors.textContrast,
    fontFamily: "Inter_600SemiBold",
  },
  lightInput: {
    color: theme.colors.smootText,
    fontFamily: "Inter_400Regular",
  },
  required: {
    color: theme.colors.mainActionState,
  },
  containerInput: {
    position: "relative",
  },
  prefixIcon: {
    position: "absolute",
    top: "28%",
    left: 10,
    zIndex: 10,
  },
  suffixIcon: {
    position: "absolute",
    top: "28%",
    right: 10,
  },
  statusSucess: {
    textAlign: "right",
    color: theme.colors.inputStatusSuccess,
    ...theme.textVariants.descriptionCard,
  },
  statusInfo: {
    textAlign: "right",
    color: theme.colors.contrast,
    ...theme.textVariants.descriptionCard,
  },
});
