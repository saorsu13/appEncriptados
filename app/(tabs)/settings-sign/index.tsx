import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";

import Loader from "@/components/molecules/Loader";
import SettingsMenuItem from "@/components/molecules/SettingsMenuItem";
import theme from "@/config/theme";
import { ThemeMode } from "@/context/theme";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { backgroundColor } from "@shopify/restyle";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

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
      <HeaderEncrypted title="Configuración" iconBack={"/home"} />
      <View style={styles.containerBody}>
        <SettingsMenuItem
          title={t(`${baseMsg}.language`)}
          value={t(`${baseMsg}.${currentLang}`)}
          path={"settings-sign/LaguageConf"}
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
    gap: 25,
    marginTop: 35,
    paddingHorizontal: 20,
    paddingBottom: 15,
    width: "100%",
  },
});

export default Settigns;
