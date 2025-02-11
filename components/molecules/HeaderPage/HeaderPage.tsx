import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

import theme from "@/config/theme";
import { router, useNavigation, useRouter } from "expo-router";
import IconSvg from "../IconSvg/IconSvg";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";
import { useRoute } from "@react-navigation/native";

type props = {
  title: string;
};

const HeaderPage = ({ title }: props) => {
  const { themeMode, toggleThemeMode } = useDarkModeTheme();

  const backRoute = () => {
    router.back();
  };

  return (
    <View
      style={[
        themeMode === ThemeMode.Dark
          ? styles.containerHeader
          : {
              ...styles.containerHeader,
              backgroundColor: theme.lightMode.colors.white,
            },
      ]}
    >
      <View style={styles.containerHeaderBar}>
        <TouchableOpacity
          style={[
            themeMode === ThemeMode.Dark
              ? styles.iconButton
              : {
                  ...styles.iconButton,
                  backgroundColor: theme.lightMode.colors.blueDark,
                },
          ]}
          onPress={() => backRoute()}
        >
          <IconSvg height={25} width={25} type="arrowback" />
        </TouchableOpacity>
        <Text
          style={[
            themeMode === ThemeMode.Dark
              ? styles.textLabel
              : { ...styles.textLabel, color: theme.lightMode.colors.blueDark },
          ]}
        >
          {title}
        </Text>
        <TouchableOpacity
          onPress={() => {
            toggleThemeMode();
          }}
          style={[
            themeMode === ThemeMode.Dark
              ? styles.iconButton
              : {
                  ...styles.iconButton,
                  backgroundColor: theme.lightMode.colors.blueDark,
                },
          ]}
        >
          <IconSvg type="contrast" width={25} height={25} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderPage;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 40,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  containerHeader: {
    display: "flex",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  containerHeaderBar: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconButton: {
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: theme.colors.roundedGray,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    width: 44,
  },
  textLabel: {
    color: theme.colors.contrastText,
    ...theme.textVariants.contentSummary,
  },
});
