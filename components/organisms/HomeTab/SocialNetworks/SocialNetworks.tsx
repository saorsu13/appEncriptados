import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { ThemeCustom } from "@/config/theme2";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import { useTheme } from "@shopify/restyle";
import React from "react";
import { View, StyleSheet, TouchableOpacity, Linking } from "react-native";

const SocialNetworks = () => {
  const LANGUAGES = {
    EN: "en",
    ES: "es",
    FR: "fr",
  };

  const { colors } = useTheme<ThemeCustom>();

  const state = useAppSelector((state) => state.settings);

  const socialNetworksData = [
    {
      type: "x",
      component: <IconSvg color={colors.white} type="x" />,
      urls: {
        en: "https://x.com/encriptados_io",
        es: "https://x.com/encriptados_io",
        fr: "https://x.com/encriptados_io",
      },
    },
    {
      type: "telegram",
      component: <IconSvg color={colors.white} type="telegram" />,
      urls: {
        en: "https://t.me/encriptados_english",
        es: "https://t.me/Encriptadosio",
        fr: "https://t.me/encriptados_francais",
      },
    },
    {
      type: "linkedin",
      component: <IconSvg color={colors.white} type="linkedin" />,
      urls: {
        en: "https://www.linkedin.com/company/encriptados-english/",
        es: "https://linkedin.com/company/encriptados",
        fr: "https://www.linkedin.com/company/encriptados-fran%C3%A7ais/",
      },
    },
    {
      type: "instagram",
      component: <IconSvg color={colors.white} type="instagram" />,
      urls: {
        en: "https://www.instagram.com/encriptados_english/",
        es: "https://www.instagram.com/encriptados.io/",
        fr: "https://www.instagram.com/encriptados_francais/",
      },
    },
    {
      type: "youtube",
      component: <IconSvg color={colors.white} type="youtube" />,
      urls: {
        en: "https://www.youtube.com/@encriptados_io",
        es: "https://www.youtube.com/@encriptados_io",
        fr: "https://www.youtube.com/@encriptados_io",
      },
    },
  ];

  const handlePress = (urls: { [key: string]: string }) => {
    const url = urls[state.lang] || urls.en;
    Linking.openURL(url);
  };

  return (
    <View style={styles.contentSocialNetworks}>
      {socialNetworksData.map((socialNetwork, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handlePress(socialNetwork.urls)}
        >
          <View
            style={{
              ...styles.logoContainer,
              backgroundColor: colors.backgroundAlternate,
            }}
          >
            {socialNetwork.component}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  contentSocialNetworks: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 65,
    height: 65,
    borderRadius: 12,
  },
});

export default SocialNetworks;
