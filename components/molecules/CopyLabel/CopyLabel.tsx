import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Clipboard,
  TouchableOpacity,
} from "react-native";

import theme from "@/config/theme";
import { useTranslation } from "react-i18next";
import IconSvg from "../IconSvg/IconSvg";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";

const CopyLabel = ({ textValue }) => {
  const { themeMode } = useDarkModeTheme();
  const { t } = useTranslation();
  const [copiedText, setCopiedText] = useState("");
  const [showPopUp, setSowPopUp] = useState(false);

  const copyToClipboard = (value) => {
    if (!showPopUp) {
      Clipboard.setString(value);
      setSowPopUp(true);
      setTimeout(() => {
        setSowPopUp(false);
      }, 2000);
    }
  };

  return (
    <View
      style={[
        themeMode === ThemeMode.Dark
          ? styles.container
          : {
              ...styles.container,
              backgroundColor: theme.lightMode.colors.blueLight,
            },
      ]}
    >
      <Text
        allowFontScaling={false}
        style={
          themeMode === ThemeMode.Dark
            ? styles.text
            : { ...styles.text, color: theme.lightMode.colors.blueDark }
        }
      >
        {showPopUp ? t(`copied`) : textValue}
      </Text>
      <TouchableOpacity
        onPress={() => copyToClipboard(textValue)}
        style={styles.buttonContainer}
      >
        <IconSvg
          color={
            themeMode === ThemeMode.Dark
              ? theme.colors.copyIcon
              : theme.lightMode.colors.gray10
          }
          height={15}
          width={25}
          type="copyicon"
        />
        {/* {showPopUp && (
          <Text style={styles.popUp}>{t("helpMessages.copied")}</Text>
        )} */}
      </TouchableOpacity>
    </View>
  );
};

export default CopyLabel;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.darkBlack01,
    borderWidth: 0.5,
    borderColor: theme.colors.borderSelect,
    borderRadius: 6,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    maxWidth: 150,
    minWidth: 110,
    height: 50,
    alignItems: "center",
  },
  text: {
    color: theme.colors.selectText,
    ...theme.textVariants.button,
    padding: 4,
    width: "80%",
  },
  buttonContainer: {
    position: "relative",
  },
  popUp: {
    color: theme.colors.borderSelect,
    backgroundColor: theme.colors.selectText,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    position: "absolute",
    bottom: 0,
    right: 22,
    zIndex: 10,
  },
});
