import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useTheme } from "@shopify/restyle";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeCustom } from "@/config/theme2";

const BannerWelcome = require("@/assets/images/bannerencriptados.png");

const WelcomeBannerLight = ({ title, description, buttonText, icon }) => {
  const { colors } = useTheme<ThemeCustom>();

  return (
    <View style={styles.container}>
      <Image
        source={BannerWelcome}
        resizeMode="cover"
        style={{ ...styles.image, opacity: 0.2 }}
      />
      <LinearGradient
        colors={["rgba(255, 255, 255, 1)", "transparent"]}
        start={{ x: 0, y: 0.4 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <View style={{ marginTop: 100, width: 300 }}>
          <Text
            allowFontScaling={false}
            style={{ ...styles.textTitle, color: colors.primaryText }}
          >
            {title}
          </Text>
        </View>

        <Text
          allowFontScaling={false}
          style={{ ...styles.textDescription, color: colors.secondaryText }}
        >
          {description}
        </Text>

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
  );
};

export default WelcomeBannerLight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    opacity: 0.9,
  },
  content: {
    zIndex: 2,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
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
    marginBottom: 10,
  },
  textDescription: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
});
