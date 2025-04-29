import { SIM_TYPES } from "@/(helpers)/mock";
import theme from "@/config/theme";
import { ThemeMode } from "@/context/theme";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import useModalAll from "@/hooks/useModalAll";
import { determineTypeSim } from "@/utils/validation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

type option = {
  label: string;
  value: any;
};

type props = {
  options: option[];
  defaultValue?: any;
  recomendedValue?: any;
  suggestText?: string;
  handleValue?: (value: string | number) => void;
  style?: Record<string, any>;
  itemStyle?: Record<string, any>;
  value?: string;
  disabled?: boolean;
};

const ButtonGroup = ({
  options,
  defaultValue,
  recomendedValue,
  suggestText,
  handleValue,
  style,
  itemStyle,
  value,
  disabled = false,
}: props) => {
  const { themeMode } = useDarkModeTheme();
  const { showModal } = useModalAll();
  const { t } = useTranslation();
  const [selectedButton, setSelectedButton] = useState(defaultValue || null);

  const handleButtonPress = (buttonValue) => {
    if (disabled) {
      return;
    }
    showModal({
      type: "alert",
      title: t("pages.home.networkProfile"),
      description: t("pages.home.networkProfileDescription"),
      textConfirm: t("actions.changeNow"),
      textCancel: t("actions.close"),
      buttonColorCancel: "#CB0808",
      buttonColorConfirm: "#10B4E7",
      onConfirm: () => {
        if (!disabled) {
          setSelectedButton(buttonValue);
          if (handleValue) handleValue(buttonValue);
        }
      },
    });
  };

  useEffect(() => {
    setSelectedButton(value);
  }, [value]);

  const currentNetwork = useAppSelector(
    (state) => state.networkProfile.networkProfile
  );

  return (
    <View style={{ ...styles.container, ...style }}>
      {options?.map((item) => (
        <View
          key={item.value}
          style={[
            styles.itemContainer,
            options.length === 1 ? styles.singleItemContainer : {},
            itemStyle,
          ]}
        >
          <TouchableOpacity
            style={[
              currentNetwork === SIM_TYPES.SG
                ? { ...styles.button, marginHorizontal: 10 }
                : styles.button,
              themeMode === ThemeMode.Light && {
                borderColor: theme.lightMode.colors.blueDark,
              },
              themeMode === ThemeMode.Dark && selectedButton === item.value
                ? styles.selectedButton
                : {},
              themeMode === ThemeMode.Light && selectedButton === item.value
                ? styles.selectedButtonLight
                : {},
              themeMode === ThemeMode.Dark && disabled
                ? styles.disabledButton
                : null,
            ]}
            onPress={() => handleButtonPress(item.value)}
          >
            <Text
              allowFontScaling={false}
              style={[
                styles.buttonText,
                themeMode === ThemeMode.Light && {
                  color: theme.lightMode.colors.blueDark,
                },
                selectedButton === item.value && [
                  styles.selectedText,
                  themeMode === ThemeMode.Light && {
                    color: theme.colors.mainActionState,
                  },
                ],
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
          {item.value === recomendedValue && suggestText && (
            <View
              style={[
                styles.sandwich,
                themeMode === ThemeMode.Dark
                  ? {}
                  : { backgroundColor: theme.colors.mainActionState },
              ]}
            >
              <Text
                allowFontScaling={false}
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  color: theme.colors.darkBlack01,
                }}
              >
                {suggestText}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 8,
    padding: 2,
  },
  itemContainer: {
    flex: 1,
    minWidth: "45%",
    maxWidth: "45%",
  },
  singleItemContainer: {
    minWidth: "100%",
    maxWidth: "100%",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: theme.colors.contrast,
    minHeight: 64,
    marginBottom: 10,
  },
  selectedButton: {
    backgroundColor: theme.colors.contrast,
  },
  selectedButtonLight: {
    backgroundColor: theme.lightMode.colors.blueDark,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: theme.colors.contrast,
    ...theme.textVariants.buttonGroup,
    width: 50,
    textAlign: "center",
  },
  selectedText: {
    color: theme.colors.darkBlack01,
  },
  sandwich: {
    backgroundColor: theme.colors.softSKin,
    borderRadius: 14,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 4,
    left: "15%",
    width: "70%",
    ...theme.textVariants.small,
  },
});

export default ButtonGroup;
