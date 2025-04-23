import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";

import Loader from "@/components/molecules/Loader";
import SettingsMenuItem from "@/components/molecules/SettingsMenuItem";
import theme from "@/config/theme";
import { ThemeMode } from "@/context/theme";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

const baseMsg = "pages.settings";

const Settigns = () => {
  const { themeMode } = useDarkModeTheme();
  const { t } = useTranslation();
  const currentLang = useAppSelector((state) => state.settings.lang);

  return (
    <ScrollView
      style={[
        themeMode === ThemeMode.Light
          ? { backgroundColor: theme.lightMode.colors.white }
          : null,
      ]}
    >
      <HeaderEncrypted owner="encriptados" title={t(`pages.home.settings`)} iconBack={"/balance"} />
      <View style={styles.containerBody}>
        <SettingsMenuItem
          title={t(`${baseMsg}.language`)}
          value={t(`${baseMsg}.${currentLang}`)}
          path={"balance/settings/sim/LaguageConf"}
        />
        {/* <SettingsMenuItem
          title={"Cambiar logo de APP"}
          path={"home/settings/sim/change-icon"}
        /> */}
        <SettingsMenuItem
          title={t("pages.home.requiredpassword")}
          path={"balance/settings/sim/access-password"}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerBody: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 35,
    paddingHorizontal: 20,
    paddingBottom: 15,
    width: "100%",
  },
});

export default Settigns;
