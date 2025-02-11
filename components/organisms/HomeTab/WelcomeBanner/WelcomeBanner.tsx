import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { ThemeCustom } from "@/config/theme2";
import { useModalPayment } from "@/context/modalpayment";
import { useTheme } from "@shopify/restyle";
import { TouchableOpacity } from "expo-custom-switch/build/Elements";
import { router } from "expo-router";
import React from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
  Text,
} from "react-native";

const BannerWelcome = require("@/assets/images/bannerencriptados.png");

const WelcomeBanner = ({ title, description, buttonText, icon }) => {
  const { colors } = useTheme<ThemeCustom>();
  return (
    <ImageBackground
      source={BannerWelcome}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text
          allowFontScaling={false}
          style={{ ...styles.textTitle, color: colors.primaryText }}
        >
          {title}
        </Text>
        <Text
          allowFontScaling={false}
          style={{ ...styles.textDescription, color: colors.secondaryText }}
        >
          {description}
        </Text>
        <View style={{ marginTop: 6 }}>
          <TouchableOpacity
            onPress={() => router.push("products-tab")}
            style={{ ...styles.button, borderColor: colors.primaryColor }}
          >
            <Text
              allowFontScaling={false}
              style={{ ...styles.buttonText, color: colors.primaryColor }}
            >
              {buttonText}
            </Text>
            <View style={{ marginLeft: 10 }}>{icon}</View>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default WelcomeBanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    paddingVertical: 70,
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 1,
  },
  content: {
    flex: 1,
    rowGap: 8,
    padding: 20,
    width: 380,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  button: {
    display: "flex",

    flexDirection: "row",
    borderWidth: 1,

    padding: 10,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: 200,
  },
  buttonText: {
    fontWeight: "600",
  },
  textTitle: {
    textAlign: "center",
    fontSize: 28,

    fontWeight: "700",
  },
  textDescription: {
    width: 280,
    textAlign: "center",
    fontSize: 16,
  },
});
