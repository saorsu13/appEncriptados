import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Clipboard,
  TouchableOpacity,
  Image,
} from "react-native";

import theme from "@/config/theme";
import { useTranslation } from "react-i18next";
import IconSvg from "../IconSvg/IconSvg";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";

interface CopySimProps {
  simName: string;
  simId: string;
  logo?: any;
}

const CopySim: React.FC<CopySimProps> = ({ simName, simId, logo }) => {
  const { themeMode } = useDarkModeTheme();
  const { t } = useTranslation();
  const [showPopUp, setShowPopUp] = useState(false);

  const copyToClipboard = (value: string) => {
    if (!showPopUp) {
      Clipboard.setString(value);
      setShowPopUp(true);
      setTimeout(() => {
        setShowPopUp(false);
      }, 2000);
    }
  };

  return (
    <View
      style={[
        styles.container,
        themeMode === ThemeMode.Light && {
          backgroundColor: theme.lightMode.colors.blueLight,
        },
      ]}
    >
      <View style={styles.innerContainer}>
        {logo && (
          <Image
            source={logo}
            style={{ width: 20, height: 20, resizeMode: "contain", marginRight: 8 }}
          />
        )}
        <Text
          allowFontScaling={false}
          style={[
            styles.text,
            themeMode === ThemeMode.Light && {
              color: theme.lightMode.colors.blueDark,
            },
          ]}
        >
          {showPopUp ? t("copied") : simName}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => copyToClipboard(simId)}
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
      </TouchableOpacity>
    </View>
  );
};

export default CopySim;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.darkBlack01,
    borderWidth: 0.5,
    borderColor: theme.colors.borderSelect,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 12,
    minWidth: 120,
    height: 50,
    alignItems: "center",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: theme.colors.selectText,
    ...theme.textVariants.button,
    padding: 4,
  },
  buttonContainer: {
    position: "relative",
  },
});