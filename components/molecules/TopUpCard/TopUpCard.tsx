import React from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { topUpCardStyles } from "./topUpCardStyles";
import { useTranslation } from "react-i18next";

const TopUpCard = () => {
  const { t, i18n } = useTranslation();
  const baseMsg = "pages.home";
  const lang = i18n.language;

  const handlePress = () => {
    Linking.openURL("https://encriptados.io/pages-sim-encriptada-sim-tim/");
  };

  // Ajustes dinámicos según idioma
  const dynamicTitleStyle =
    lang === "fr"
      ? { fontSize: 13, lineHeight: 14 }
      : lang === "en"
      ? { fontSize: 14, lineHeight: 18 }
      : {};

  const dynamicButtonStyle =
    lang === "fr" || lang === "en"
      ? {
          paddingVertical: 6,
          paddingHorizontal: 25,
        }
      : {};

  const dynamicButtonTextStyle =
    lang === "fr" || lang === "en"
      ? {
          fontSize: 13,
        }
      : {};

  return (
    <LinearGradient
      colors={["#6ADDFF", "#A8EBFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={topUpCardStyles.container}
    >
      <View style={topUpCardStyles.container}>
        <View style={topUpCardStyles.textContainer}>
          <Text style={[topUpCardStyles.title, dynamicTitleStyle]}>
            {t(`${baseMsg}.topUpCard.title`)}
          </Text>

          <TouchableOpacity
            style={[topUpCardStyles.button, dynamicButtonStyle]}
            onPress={handlePress}
          >
            <Text style={[topUpCardStyles.buttonText, dynamicButtonTextStyle]}>
              {t(`${baseMsg}.topUpCard.buttonText`)}
            </Text>
          </TouchableOpacity>
        </View>

        <Image
          source={require("@/assets/images/image 316.png")}
          style={topUpCardStyles.image}
        />
      </View>
    </LinearGradient>
  );
};

export default TopUpCard;