import theme from "@/config/theme";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import RadioButton from "@/components/molecules/RadioButton/RadioButton";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateLanguage } from "@/features/settings/settingsSlice";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import useLocalPassword from "@/hooks/useLocalPassword";
const baseMsg = "pages.language";

const mockData = [
  {
    label: "en",
    value: "en",
  },
  {
    label: "es",
    value: "es",
  },
  {
    label: "fr",
    value: "fr",
  },
];

const LaguageConf = () => {
  const { themeMode } = useDarkModeTheme();
  const { t, i18n } = useTranslation();
  const currentLang = useSelector((state: any) => state.settings.lang);
  const [lang, setLang] = useState(currentLang || "es");
  const dispatch = useDispatch();

  const handleChangeLang = (value) => {
    setLang(value);
    dispatch(updateLanguage(value));
    i18n.changeLanguage(value);
  };

  useEffect(() => {
    i18n.changeLanguage(currentLang);
  }, [currentLang]);

  return (
    <ScrollView
      style={
        themeMode === ThemeMode.Light
          ? { backgroundColor: theme.lightMode.colors.white }
          : null
      }
    >
      <HeaderEncrypted
        title={t(`${baseMsg}.title`)}
        iconBack="products-tab/settings/products"
      />

      <View style={styles.containerBody}>
        <View style={styles.container}>
          {mockData.map((item, index) => (
            <RadioButton
              key={`${index}-${item}`}
              handleChange={() => handleChangeLang(item.value)}
              value={item.value}
              selectedValue={lang}
              enabledText={false}
              variant={""}
            >
              <Text allowFontScaling={false} style={styles.radioLabel}>
                <Text allowFontScaling={false}>
                  {" "}
                  {t(`settings.lang.${item.label}`)}
                </Text>
              </Text>
            </RadioButton>
          ))}
        </View>
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
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 8,
    width: "100%",
  },
  radioLabel: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    color: theme.colors.contrast,
    ...theme.textVariants.textInfo,
  },
});

export default LaguageConf;
