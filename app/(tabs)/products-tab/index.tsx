import { Stack } from "expo-router";
import { Text, View, StyleSheet, ScrollView } from "react-native";

import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";

import React, { useState } from "react";

import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";

import ProductsSimSection from "@/components/organisms/ProductsSimSection/ProductsSimSection";
import ProductsAplicationSection from "@/components/organisms/ProductsAplicationSection/ProductsAplicationSection";
import ProductsPhoneSection from "@/components/organisms/ProductsPhoneSection/ProductsPhoneSection";
import FilterMenu from "@/components/molecules/FilterMenu/FilterMenu";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import { useDispatch } from "react-redux";
import {
  SECTIONS,
  setProduct,
} from "@/features/menuCurrentProduct/menuCurrentProductSlice";

import { ThemeCustom } from "@/config/theme2";
import { useTheme } from "@shopify/restyle";
import { t } from "i18next";

export default function ProductsTab() {
  const { themeMode } = useDarkModeTheme();

  const [open, setOpen] = useState(false);

  const valueOfMenu = useAppSelector((state) => {
    return state.menuCurrentProduct.currentProduct;
  });

  let component;

  switch (valueOfMenu) {
    case SECTIONS.SIM:
      component = <ProductsSimSection />;
      break;
    case SECTIONS.APPLICATION:
      component = <ProductsAplicationSection />;
      break;
    case SECTIONS.PHONE:
      component = <ProductsPhoneSection />;
      break;
    default:
      component = null;
      break;
  }

  const { colors } = useTheme<ThemeCustom>();

  return (
    <>
      <ScrollView
        nestedScrollEnabled={true}
        style={
          themeMode === ThemeMode.Dark
            ? { backgroundColor: "black" }
            : { backgroundColor: "white" }
        }
      >
        <HeaderEncrypted settingsLink="products-tab/settings/products" />
        <Stack.Screen
          options={{
            title: "Products",
          }}
        />

        <Text
          allowFontScaling={false}
          style={{
            fontWeight: 600,
            fontSize: 22,
            color: colors.primaryText,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          {t("pages.home-tab.ourProducts")}
        </Text>
        <View
          style={{
            width: "90%",
            flex: 1,
            marginBottom: 40,
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          {/* <DropdownButton
            value={value}
            items={items}
            open={open}
            setItems={setItems}
            setOpen={setOpen}
            setValue={setValue}
          /> */}
          <FilterMenu />
        </View>

        <View>{component}</View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 50,
    height: 50,
  },
});
