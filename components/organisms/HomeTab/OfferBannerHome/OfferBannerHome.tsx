import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { ThemeCustom } from "@/config/theme2";
import { ThemeMode } from "@/context/theme";
import { setProduct } from "@/features/menuCurrentProduct/menuCurrentProductSlice";
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
import { useDispatch } from "react-redux";

const DarkBanner = require("@/assets/images/background-split-home.png");

const LightBanner = require("@/assets/images/background-splite-home-light.png");

const SimImage = require("@/assets/images/card-encriptados.png");

const OfferBannerHome = () => {
  const { colors } = useTheme<ThemeCustom>();

  const { themeMode } = useDarkModeTheme();

  const dispatch = useDispatch();

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
          rowGap: 10,
          height: 500,
        }}
      >
        <View
          style={{
            backgroundColor: colors.backgroundAlternate2,
            padding: 13,
            borderRadius: 14,
            marginTop: 10,
          }}
        >
          <IconSvg color={colors.secondaryColor} type="codesafe" />
        </View>
        <Text
          allowFontScaling={false}
          style={{ color: colors.primaryText, fontWeight: 700, fontSize: 24 }}
        >
          {t("pages.home-tab.encryptedSim")}
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
          {t("pages.home-tab.protectYourself")}
        </Text>
        <ImageBackground
          resizeMode="cover"
          style={styles.imageEncript}
          source={SimImage}
        />
      </View>

      <View
        style={{
          width: "100%",
          height: 160,
        }}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/products-tab/aboutproduct/50228",
                params: { fromHome: "true" },
              });
            }}
            
            style={{
              marginBottom: 10,
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
              {t("pages.home-tab.buy")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              dispatch(setProduct("sim"));
              router.push(`${PRODUCT_TAB_ROUTES.PRODUCT_TAB_INDEX}`);
            }}
          >
            <Text allowFontScaling={false} style={{ color: "white" }}>
              {t("pages.home-tab.moreInfo")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default OfferBannerHome;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 750,
  },
  imageEncript: {
    width: 300,
    marginRight: 30,
    height: 300,
    marginBottom: 40,
  },
});
