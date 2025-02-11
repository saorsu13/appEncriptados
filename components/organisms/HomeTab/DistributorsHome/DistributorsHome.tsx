import React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { router } from "expo-router";
import { t } from "i18next";

const DistributorsHome = () => {
  const { colors } = useTheme<ThemeCustom>();
  const { themeMode } = useDarkModeTheme();

  const Distributors = require("@/assets/images/distributors.jpg");

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <View style={styles.contentContainer}>
        <View
          style={{
            width: 150,
            padding: 10,

            borderRadius: 50,
          }}
        >
          <Text
            allowFontScaling={false}
            style={{
              color: colors.primaryColor,
              textAlign: "center",
              fontWeight: 700,
              width: "100%",

              fontSize: 18,
            }}
          >
            {t("pages.home-tab.distributors")}
          </Text>
        </View>

        <Text
          allowFontScaling={false}
          style={{
            color: colors.primaryText,
            textAlign: "center",
            fontWeight: "400",
            fontSize: 20,
          }}
        >
          {t("pages.home-tab.distributors-title")}
        </Text>
        <Text
          allowFontScaling={false}
          style={{
            color: colors.secondaryText,
            textAlign: "center",
            fontWeight: "400",
            width: 320,
            fontSize: 14,
          }}
        >
          {t("pages.home-tab.distributors-description")}
        </Text>

        <TouchableOpacity
          onPress={() => router.push("home-tab/distributors")}
          style={{ ...styles.button, borderColor: colors.primaryColor }}
        >
          <Text
            allowFontScaling={false}
            style={{ ...styles.buttonText, color: colors.primaryColor }}
          >
            {t("pages.home-tab.joinUs")}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <ImageBackground
          source={Distributors}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          {/* Aquí puedes colocar más contenido si lo necesitas */}
        </ImageBackground>
      </View>

      {/* <CarrouselDistributors /> */}
    </View>
  );
};

export default DistributorsHome;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  contentContainer: {
    rowGap: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  imageContainer: {
    borderRadius: 10,
    overflow: "hidden",
    width: 400,
    height: 320,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  buttonText: {
    fontWeight: "600",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    padding: 15,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: 200,
  },
});
