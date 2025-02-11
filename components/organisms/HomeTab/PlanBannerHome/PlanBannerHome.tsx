import { ThemeMode } from "@/context/theme";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { t } from "i18next";
import React from "react";
import { ImageBackground, StyleSheet, View, Text } from "react-native";

const PlanBannerHome = () => {
  const CardBanner = require("@/assets/images/background-split-home2.png");

  const CardDarkBanner = require("@/assets/images/background-split-home2-dark.png");

  const CellPhoneImage = require("@/assets/images/cellphonebanner.png");

  const { themeMode } = useDarkModeTheme();
  return (
    <ImageBackground
      source={themeMode === ThemeMode.Light ? CardBanner : CardDarkBanner}
      resizeMode="cover"
      style={styles.container}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Text
          allowFontScaling={false}
          style={{ color: "#10B4E7", fontWeight: "700", fontSize: 34 }}
        >
          {t("pages.home-tab.freeEsim")}
        </Text>
        <Text
          allowFontScaling={false}
          style={{ color: "#0F4457", fontWeight: "700", fontSize: 34 }}
        >
          {t("pages.home-tab.withYourPurchase")}
        </Text>
        <Text
          allowFontScaling={false}
          style={{ color: "#0F4457", fontWeight: "400", fontSize: 16 }}
        >
          {t("pages.home-tab.plans")}
        </Text>
        <ImageBackground
          resizeMode="cover"
          style={styles.imageEncript}
          source={CellPhoneImage}
        />
      </View>
    </ImageBackground>
  );
};

export default PlanBannerHome;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 600,
  },
  imageEncript: {
    width: 400,

    height: 400,
  },
});
