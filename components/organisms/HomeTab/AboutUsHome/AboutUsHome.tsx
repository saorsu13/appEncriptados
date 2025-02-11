import IconEncriptados from "@/assets/icons/IconEncriptados";
import { ThemeCustom } from "@/config/theme2";
import { useTheme } from "@shopify/restyle";
import { t } from "i18next";
import React from "react";
import { ImageBackground, StyleSheet, View, Text } from "react-native";

const AboutUsHome = () => {
  const CardBlog = require("@/assets/images/security-aboutus.png");

  const { colors } = useTheme<ThemeCustom>();
  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <View style={styles.contentContainer}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 150,
            padding: 10,

            borderRadius: 14,
          }}
        >
          <Text
            allowFontScaling={false}
            style={{
              color: colors.primaryColor,
              textAlign: "center",
              fontWeight: 700,

              fontSize: 18,
            }}
          >
            {t("pages.home-tab.aboutUs")}
          </Text>
        </View>

        <IconEncriptados color={colors.neutro} />

        <View style={styles.imageContainer}>
          <ImageBackground
            style={styles.image}
            resizeMode="cover"
            source={CardBlog}
          />
        </View>

        <Text
          allowFontScaling={false}
          style={{
            fontSize: 14,
            fontWeight: "300",
            color: colors.secondaryText,
            textAlign: "justify",
          }}
        >
          {t("pages.home-tab.aboutUsDescription")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",

    padding: 20,
  },
  imageContainer: {
    borderRadius: 15,
    overflow: "hidden",
    width: 350,
    height: 250,
    alignSelf: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    justifyContent: "center",
    rowGap: 20,
    alignItems: "center",
    maxWidth: 400,
  },
});

export default AboutUsHome;
