import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Formik } from "formik";
import RadioButton from "../../molecules/RadioButton/RadioButton";
import theme from "@/config/theme";

import { useTranslation } from "react-i18next";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";

type props = {
  voiceFilter?: any;
  handleVoiceFilter?: (value: any) => void;
  disabled?: boolean;
};

const SoundsFilter = ({
  voiceFilter,
  handleVoiceFilter,
  disabled = false,
}: props) => {
  const { themeMode } = useDarkModeTheme();
  const { t } = useTranslation();
  const mockData = [
    {
      value: "1",
      label: `${t("filterText")} 1`,
    },
    {
      value: "2",
      label: `${t("filterText")} 2`,
    },
    {
      value: "3",
      label: `${t("filterText")} 3`,
    },
    {
      value: "4",
      label: `${t("filterText")} 4`,
    },
    {
      value: "5",
      label: `${t("filterText")} 5`,
    },
    {
      value: "6",
      label: `${t("filterText")} 6`,
    },
    {
      value: "7",
      label: `${t("filterText")} 7`,
    },
    // {
    //   value: "7",
    //   label: `${t("filterText")} 8`,
    // },
  ];

  return (
    <View style={styles.container}>
      {mockData.map((item, index) => (
        <RadioButton
          variant={"voicefilter"}
          key={`${index}-${item}`}
          handleChange={handleVoiceFilter}
          handleBlur={() => {}}
          value={item.value}
          name="voicefilter"
          selectedValue={voiceFilter}
          disabled={disabled}
        >
          <View style={styles.radioLabelContainer}>
            <View
              style={
                themeMode === ThemeMode.Dark
                  ? styles.containerLogoFilter
                  : {
                      ...styles.containerLogoFilter,
                      backgroundColor: theme.lightMode.colors.blueDark,
                    }
              }
            >
              <IconSvg
                color={theme.lightMode.colors.white}
                type="filtericon"
                height={25}
                width={25}
              />
            </View>

            <Text
              allowFontScaling={false}
              style={[
                themeMode === ThemeMode.Light && voiceFilter
                  ? {
                      ...styles.radioLabel,
                      color: theme.lightMode.colors.blueDark,
                    }
                  : styles.radioLabel,
              ]}
            >
              <Text allowFontScaling={false}>{item.label}</Text>
            </Text>
          </View>
        </RadioButton>
      ))}
    </View>
  );
};

export default SoundsFilter;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
    gap: 8,
    flexGrow: 1,
  },
  radioLabelContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "50%",
  },
  radioLabel: {
    flex: 1,
    gap: 10,
    marginLeft: 10,
    color: theme.lightMode.colors.white,
    ...theme.textVariants.textInfo,
  },
  containerLogoFilter: {
    padding: 5,
    backgroundColor: theme.lightMode.colors.blueDark,
    borderRadius: 7,
  },
});
