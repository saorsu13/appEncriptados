import { ThemeCustom } from "@/config/theme2";
import {
  SECTIONS,
  setProduct,
} from "@/features/menuCurrentProduct/menuCurrentProductSlice";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import { useTheme } from "@shopify/restyle";
import { t } from "i18next";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";

const FilterMenu = () => {
  const { colors } = useTheme<ThemeCustom>();

  const selectedValue = useAppSelector((state) => {
    return state.menuCurrentProduct.currentProduct;
  });

  const dispatch = useDispatch();

  return (
    <View
      style={{
        ...styles.menuContainer,
        backgroundColor: colors.backgroundAlternate,
      }}
    >
      <TouchableOpacity
        style={[
          styles.menuItem,
          selectedValue === SECTIONS.APPLICATION && {
            backgroundColor: colors.backgroundSecondary,
          },
        ]}
        onPress={() => dispatch(setProduct(SECTIONS.APPLICATION))}
      >
        <Text
          allowFontScaling={false}
          style={[
            styles.menuText,
            selectedValue === SECTIONS.APPLICATION && {
              color: colors.primaryText,
            },
          ]}
        >
          Apps
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.menuItem,
          selectedValue === SECTIONS.SIM && {
            backgroundColor: colors.backgroundSecondary,
          },
        ]}
        onPress={() => dispatch(setProduct(SECTIONS.SIM))}
      >
        <Text
          allowFontScaling={false}
          style={[
            styles.menuText,
            selectedValue === SECTIONS.SIM && {
              color: colors.primaryText,
            },
          ]}
        >
          Sim's
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.menuItem,
          selectedValue === SECTIONS.PHONE && {
            backgroundColor: colors.backgroundSecondary,
          },
        ]}
        onPress={() => dispatch(setProduct(SECTIONS.PHONE))}
      >
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    columnGap: 10,
    borderRadius: 40,
    paddingVertical: 15,
    paddingHorizontal: 50,
  },
  menuItem: {
    height: 60, // Ajuste para mejorar la proporción circular
    width: 110, // Ajuste para mejorar la proporción circular
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30, // Esto asegura que el contenedor sea completamente circular
  },
  menuText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold", // Asegura que el texto sea claramente visible
  },
});

export default FilterMenu;
