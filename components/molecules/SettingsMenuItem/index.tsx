import theme from "@/config/theme";
import { ThemeMode } from "@/context/theme";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { router } from "expo-router";
import React, { ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type props = {
  title: string;
  value?: string;
  path: any;
};

const SettingsMenuItem = ({ title, value, path = "/" }: props) => {
  const { themeMode } = useDarkModeTheme();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(path)}
    >
      <View
        style={[
          themeMode === ThemeMode.Dark
            ? styles.containerBody
            : {
                ...styles.containerBody,
                backgroundColor: theme.lightMode.colors.blueDark,
              },
        ]}
      >
        <Text allowFontScaling={false} style={styles.title}>
          {title}
        </Text>
        <View style={styles.settingValue}>
          {value && (
            <Text allowFontScaling={false} style={styles.value}>
              {value}
            </Text>
          )}
          <View style={styles.arrow}></View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SettingsMenuItem;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  containerBody: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    justifyContent: "space-between",
    flexGrow: 1,
    paddingHorizontal: 17,
    paddingVertical: 20,
    borderWidth: 0.5,
    borderRadius: 14,
    width: "100%",
    backgroundColor: theme.colors.darkBlack01,
  },
  title: {
    color: theme.colors.contrast,
    ...theme.textVariants.captionCard,
  },
  value: {
    color: theme.colors.SettingsOptionItemValue,
    ...theme.textVariants.small,
  },
  arrow: {
    borderWidth: 2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderColor: theme.colors.contrast,
    width: 10,
    height: 10,
    transform: "rotate(45deg)",
    marginLeft: 10,
  },
  settingValue: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
