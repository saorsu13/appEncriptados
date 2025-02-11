import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import theme from "@/config/theme";
import IconSvg from "../IconSvg/IconSvg";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";

type item = {
  label: string;
  value: string | number;
  icon?: () => React.ReactNode; // Ajusta para el componente de la bandera
};

type props = {
  label?: string;
  items: item[];
  value?: string | number;
  handleValue: any;
  placeholder?: string;
  resetValue?: string;
  country?: boolean;
};

const { width } = Dimensions.get("window");

const Dropdown = ({
  label,
  items,
  value,
  handleValue,
  placeholder,
  country,
}: props) => {
  const { themeMode } = useDarkModeTheme();
  const [selectedValue, setSelectedValue] = useState(value);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <View
      style={
        country
          ? { ...styles.container, width: "83%", height: 20 }
          : styles.container
      }
      aria-label="dropdown"
    >
      {label && (
        <Text
          allowFontScaling={false}
          style={[
            themeMode === ThemeMode.Dark
              ? styles.label
              : { ...styles.label, color: theme.lightMode.colors.gray },
          ]}
        >
          {label}
        </Text>
      )}
      <DropDownPicker
        placeholder={placeholder || ""}
        open={open}
        value={selectedValue}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedValue}
        onChangeValue={(value) => handleValue(value)}
        style={[
          themeMode === ThemeMode.Dark
            ? styles.picker
            : {
                ...styles.picker,
                backgroundColor: theme.lightMode.colors.blueDark,
              },
        ]}
        textStyle={styles.pickerItem}
        labelStyle={
          themeMode === ThemeMode.Dark
            ? styles.pickerItem
            : { ...styles.pickerItem, color: theme.lightMode.colors.white }
        }
        containerStyle={styles.pickerContainerItems}
        containerProps={{ style: styles.pickerContainerItems }}
        showArrowIcon={true}
        ArrowUpIconComponent={({ style }) => (
          <IconSvg height={25} width={25} type="arrowupicon" />
        )}
        ArrowDownIconComponent={({ style }) => (
          <IconSvg height={25} width={25} type="arrowupicon" />
        )}
        listMode="MODAL"
        modalProps={{
          animationType: "fade",
        }}
        modalContentContainerStyle={
          themeMode === ThemeMode.Dark
            ? {
                backgroundColor: theme.colors.darkBlack01,
              }
            : { backgroundColor: theme.lightMode.colors.blueDark }
        }
        CloseIconComponent={() => (
          <IconSvg height={25} type="closeicon" width={25} />
        )}
        itemSeparator={true}
      />
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 15,
    zIndex: 10,
  },
  label: {
    paddingVertical: 2.5,
    color: theme.colors.selectLabel,
    ...theme.textVariants.descriptionCard,
  },
  picker: {
    backgroundColor: theme.colors.darkBlack01,
    borderWidth: 0.5,
    borderColor: theme.colors.borderSelect,
    borderRadius: 8,
    color: theme.colors.selectText,
    paddingHorizontal: 14,
    paddingVertical: 8,
    ...theme.textVariants.select,
  },
  pickerItem: {
    color: theme.colors.selectText,
    ...theme.textVariants.select,
    borderRadius: 10,
  },
  pickerContainerItems: {
    backgroundColor: theme.colors.darkBlack01,
    borderRadius: 10,
  },
});
