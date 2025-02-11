import theme from "@/config/theme";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Pressable,
  View,
} from "react-native";

import { opacity } from "@shopify/restyle";
import IconSvg from "../IconSvg/IconSvg";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";

type props = {
  handleChange: (name: string) => (value: any) => void;
  handleBlur: (value: any) => void;
  value: string | number;
  name: string;
  selectedValue: string | number;
  children: ReactNode;
  enabledText?: boolean;
  variant?: string | "light" | "voicefilter";
  disabled?: boolean;
};

const RadioButton = ({
  handleChange,
  handleBlur,
  value,
  name,
  selectedValue,
  children,
  enabledText = true,
  variant,
  disabled = false,
}: any) => {
  const { t } = useTranslation();

  const { themeMode } = useDarkModeTheme();

  return (
    <Pressable
      onPress={() => {
        if (!disabled) handleChange(value);
      }}
      style={{
        ...styles.container,
        ...(themeMode === ThemeMode.Dark
          ? styles.container
          : variant === "voicefilter" && ThemeMode.Light === themeMode
          ? styles.containerVoiceFilter
          : {
              backgroundColor: theme.lightMode.colors.blueDark,
            }),

        ...(disabled ? styles.containerDisabled : {}),
      }}
      // activeOpacity={0.9}
    >
      {children}
      <View style={styles.textHelperContainer}>
        {selectedValue === value ? (
          <>
            <Text allowFontScaling={false} style={styles.textHelperContainer}>
              {enabledText && (
                <Text
                  style={[
                    themeMode === ThemeMode.Light && variant === "voicefilter"
                      ? {
                          ...styles.textHelper,
                          color: theme.lightMode.colors.blueDark,
                        }
                      : { ...styles.textHelper },
                  ]}
                >
                  {t("states.activated")}
                </Text>
              )}
            </Text>
            <IconSvg width={25} height={25} type="radiochecked" />
          </>
        ) : (
          <>
            <Text allowFontScaling={false} style={styles.textHelperContainer}>
              {enabledText && (
                <Text
                  style={{ ...styles.textHelper, ...styles.textHelperDisabled }}
                >
                  {t("states.disabled")}
                </Text>
              )}
            </Text>

            <IconSvg height={25} width={25} type="radiounchek" />
          </>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: theme.colors.darkBlack01,
  },

  containerVoiceFilter: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: theme.lightMode.colors.blueLight,
  },
  containerDisabled: {
    opacity: 0.25,
  },
  containerDark: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: theme.colors.darkBlack01,
    width: "100%",
  },
  textHelperContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    ...theme.textVariants.helper,
    fontWeight: "300",
  },
  textHelper: {
    display: "flex",
    alignItems: "center",
    paddingTop: 3,
    color: theme.lightMode.colors.white,
  },
  textHelperDisabled: {
    color: theme.colors.secondaryText,
    pointerEvents: "none",
  },
});

export default RadioButton;
