import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import Button from "@/components/atoms/Button/Button";

import { Button as RNButton } from "react-native";
import IconSvg from "../IconSvg/IconSvg";
import { Product } from "./ListOfProductCards";
import { SvgUri } from "react-native-svg";
import { useModalPayment } from "@/context/modalpayment";
import { router } from "expo-router";
import { TouchableOpacity } from "expo-custom-switch/build/Elements";
import { PRODUCT_TAB_ROUTES } from "@/routes/ProductsTabsRoutes";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { t } from "i18next";
import GradientBanner from "../GradientBanner/GradientBanner";

export type TypeOfProduct = "phone" | "product" | "offers";

interface CardProductItemProps {
  product: Product;
  type: TypeOfProduct;
  widthImage: number;
  heightImage: number;
  isFirstItem: boolean; // Nueva prop
}

const CardProductItem: React.FC<CardProductItemProps> = ({
  product,
  type,
  widthImage,
  heightImage,
  isFirstItem, // Usar la nueva prop
}) => {
  const renderImage = () => {
    if (product.image.endsWith(".svg")) {
      return (
        <SvgUri
          uri={product.image}
          width={widthImage}
          height={heightImage}
          style={[
            styles.imageBackground,
            { width: widthImage, height: heightImage },
          ]}
        />
      );
    } else {
      return (
        <ImageBackground
          style={[
            styles.imageBackground,
            { width: widthImage, height: heightImage },
          ]}
          source={{ uri: product.image }}
          resizeMode="contain"
        />
      );
    }
  };

  const { openModalWithParams } = useModalPayment();
  const { colors } = useTheme<ThemeCustom>();
  const { themeMode } = useDarkModeTheme();

  if (type === "offers") {
    return (
      <View style={[styles.cardContainer, isFirstItem && styles.fullWidthCard]}>
        <View
          style={{
            ...styles.innerContainer,
            backgroundColor: colors.white,
          }}
        >
          <View style={{ marginTop: 20 }}>{renderImage()}</View>

          <Text
            allowFontScaling={false}
            style={{
              padding: 9,
              fontSize: 12,
              textAlign: "center",
              color: "black",
            }}
          >
            Plan de datos para SIM Encriptada + eSIM gratis
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center", // Alinea los elementos horizontalmente
              justifyContent: "center",
              columnGap: 4, // Centra los elementos en el contenedor
            }}
          >
            <Text
              allowFontScaling={false}
              style={{ color: "black", fontWeight: "bold" }}
            >
              $25.00
            </Text>
            <Text allowFontScaling={false} style={{ fontSize: 10 }}>
              + 25% de saldo
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              marginTop: 2,
              paddingHorizontal: 5,
              paddingVertical: 12,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: colors.primaryColor,
                paddingVertical: 10,
                borderRadius: 25,
                alignItems: "center",
              }}
            >
              <Text allowFontScaling={false} style={styles.buttonText}>
                {t("pages.home-tab.buy")}{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.cardContainer,
        type === "phone" && styles.phoneContainer,
        isFirstItem && styles.fullWidthCard, // Aplicar estilo condicional
      ]}
    >
      <View
        style={{
          ...styles.innerContainer,
          backgroundColor: colors.backgroundSecondary,
        }}
      >
        <View style={{ marginTop: 20 }}>{renderImage()}</View>
        <Text
          allowFontScaling={false}
          style={{ ...styles.productnametext, color: colors.primaryText }}
        >
          {product.title}
        </Text>
        <Text
          allowFontScaling={false}
          style={{ ...styles.productpricetext, color: colors.secondaryText }}
        >
          {t("pages.home-tab.from")} ${product.price} {product.currency}
        </Text>

        <View
          style={
            type === "product"
              ? { width: "60%", marginTop: 2 }
              : { width: "80%" }
          }
        >
          <Button
            size="small"
            onClick={() => openModalWithParams(product.id, themeMode, "es")}
            variant="primary"
          >
            {t("pages.home-tab.buy")}
          </Button>
        </View>

        <View style={styles.infoContainer}>
          <TouchableOpacity
            onPress={() =>
              router.push(
                `${PRODUCT_TAB_ROUTES.PRODUCT_TAB_INDEX}${PRODUCT_TAB_ROUTES.INFO_PRODUCT}${product.id}`
              )
            }
          >
            <Text
              allowFontScaling={false}
              style={[{ ...styles.textInformation, color: colors.primaryText }]}
            >
              {t("pages.home-tab.moreInfo")}
            </Text>
          </TouchableOpacity>

          <IconSvg
            height={9}
            width={12}
            color={colors.primaryText}
            type="arrowright"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: "50%",
    padding: 5,
  },
  imageBackground: {
    width: 150,
    height: 150,
  },
  phoneContainer: {
    width: "100%",
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: "center",
  },
  productnametext: {
    marginTop: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007BFF", // Color azul
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25, // Bordes redondeados
    alignItems: "center",
  },
  productpricetext: {
    fontWeight: "300",
    padding: 2,
    color: "red",
    textAlign: "center",
  },
  textInformation: {
    marginTop: 15,
    marginBottom: 20,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidthCard: {
    width: "100%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
  },
});

export default CardProductItem;
