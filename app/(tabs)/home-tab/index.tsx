import { View, StyleSheet, ScrollView, Button } from "react-native";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import WelcomeBanner from "@/components/organisms/HomeTab/WelcomeBanner/WelcomeBanner";
import OfferBannerHome from "@/components/organisms/HomeTab/OfferBannerHome/OfferBannerHome";
import PlanBannerHome from "@/components/organisms/HomeTab/PlanBannerHome/PlanBannerHome";
import DistributorsHome from "@/components/organisms/HomeTab/DistributorsHome/DistributorsHome";
import BlogEncriptados from "@/components/organisms/HomeTab/BlogEncriptados/BlogEncriptados";
import AboutUsHome from "@/components/organisms/HomeTab/AboutUsHome/AboutUsHome";
import PaymentsHome from "@/components/organisms/HomeTab/PaymentsHome/PaymentsHome";
import SocialNetworks from "@/components/organisms/HomeTab/SocialNetworks/SocialNetworks";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import WelcomeBannerLight from "@/components/organisms/HomeTab/WelcomeBanner/WelcomeBannerLight";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";
import { t } from "i18next";
import OffersHome from "@/components/organisms/HomeTab/OffersHome/OffersHome";
import { useQuery } from "@tanstack/react-query";
import { getVersion } from "@/api/version";

export default function HomeTab() {
  const { colors } = useTheme<ThemeCustom>();

  const { themeMode } = useDarkModeTheme();

  return (
    <ScrollView
      style={{ ...styles.container, backgroundColor: colors.background }}
    >
      <HeaderEncrypted settingsLink="home-tab/settings/home" />

      {themeMode === ThemeMode.Dark ? (
        <View style={{ marginTop: 20 }}>
          <WelcomeBanner
            title={t("pages.home-tab.welcomebanner-title")}
            description={t("pages.home-tab.welcomebanner-description")}
            buttonText={t("pages.home-tab.goToStore")}
            icon={<IconSvg color={colors.primaryColor} type="bag" />}
          />
        </View>
      ) : null}

      {themeMode === ThemeMode.Light ? (
        <View style={{ marginTop: 20 }}>
          <WelcomeBannerLight
            title={t("pages.home-tab.welcomebanner-title")}
            description={t("pages.home-tab.welcomebanner-description")}
            buttonText={t("pages.home-tab.goToStore")}
            icon={<IconSvg color={colors.primaryColor} type="bag" />}
          />
        </View>
      ) : null}
      <View style={{ marginTop: 0 }}>
        <OfferBannerHome />
      </View>

      <View style={{ marginTop: 0 }}>
        <OffersHome />
      </View>

      <PlanBannerHome />
      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <DistributorsHome />
      </View>

      <View
        style={{
          marginTop: 20,
          backgroundColor: colors.background,
        }}
      >
        <BlogEncriptados />
      </View>

      <View
        style={{
          marginTop: 20,
          backgroundColor: "#171717",
        }}
      >
        <AboutUsHome />
      </View>

      <View
        style={{
          marginTop: 20,
          backgroundColor: "#171717",
        }}
      >
        <PaymentsHome />
      </View>

      <View
        style={{
          marginTop: 20,
          marginBottom: 50,
        }}
      >
        <SocialNetworks />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
  },

  containerHeader: {
    gap: 40,
    paddingHorizontal: 20,
    paddingVertical: 15,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    alignItems: "center",

    aspectRatio: 1,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    width: 44,
  },
  bellIcon: {
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    aspectRatio: 1,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    width: 44,
  },
  image: {
    width: 50,
    height: 50,
  },
});
