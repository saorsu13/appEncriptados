import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { ThemeCustom } from "@/config/theme2";
import { ThemeMode } from "@/context/theme";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { PRODUCT_TAB_ROUTES } from "@/routes/ProductsTabsRoutes";
import { useTheme } from "@shopify/restyle";
import { TouchableOpacity } from "expo-custom-switch/build/Elements";
import { router } from "expo-router";
import { t } from "i18next";
import React from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
  Text,
  Image,
} from "react-native";

const DarkBanner = require("@/assets/images/background-split-home-gradient.png");
const LightBanner = require("@/assets/images/background-split-home-gradient-light.png");
const SimImage = require("@/assets/images/offers-banner.png");

const OffersHome = () => {
  const { colors } = useTheme<ThemeCustom>();
  const { themeMode } = useDarkModeTheme();

  return (
    <ImageBackground
      source={themeMode === ThemeMode.Dark ? DarkBanner : LightBanner}
      resizeMode="cover"
      style={styles.container}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          rowGap: 10, // Reducir rowGap a 10
          height: 250,
        }}
      >
        <Text
          allowFontScaling={false}
          style={{ color: colors.primaryText, fontWeight: 700, fontSize: 24 }}
        >
          {t("pages.home-tab.offers")}
        </Text>

        <Text
          allowFontScaling={false}
          style={{
            color: colors.secondaryText,
            fontWeight: 400,
            fontSize: 16,
            width: 280,
            textAlign: "center",
          }}
        >
          {t("pages.home-tab.offerdescription")}
        </Text>

        <ImageBackground
          resizeMode="contain"
          style={styles.imageEncript}
          source={SimImage}
        />
      </View>

      <View
        style={{
          width: "100%",
          height: 100, // Reducir la altura a 100
        }}
      >
        <View style={{ flex: 1, alignItems: "center", height: 2 }}>
          <TouchableOpacity
            onPress={() => router.push(`/home-tab/offers`)}
            style={{
              marginBottom: 8, // Reducir el marginBottom a 8
              backgroundColor: "#E3F8FF",
              paddingHorizontal: 5,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text
              allowFontScaling={false}
              style={{
                color: "#0F4457",
                width: 180,
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              {t("pages.home-tab.offers")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default OffersHome;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 550,
  },
  imageEncript: {
    width: "100%",
    height: 250,
  },
});
