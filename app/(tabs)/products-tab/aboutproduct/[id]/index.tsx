import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  ScrollView,
  ImageSourcePropType,
  TouchableHighlight,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useFocusEffect, router, useLocalSearchParams } from "expo-router";
import { BackHandler, Platform } from "react-native";
import { useCallback } from "react";


import { getProductsById } from "@/api/productsTab";
import Button from "@/components/atoms/Button/Button";
import CardInfo from "@/components/molecules/CardInfo/CardInfo";
import CarouselFeatures from "@/components/molecules/CarouselFeatures/CarouselFeatures";
import FAQAccordion from "@/components/molecules/FAQAccordion/FAQAccordion";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import theme from "@/config/theme";
import { useModalPayment } from "@/context/modalpayment";
import { setLoading } from "@/features/loading/loadingSlice";
import { PRODUCT_TAB_ROUTES } from "@/routes/ProductsTabsRoutes";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import { t } from "i18next";

const ProductPage = () => {
  interface Feature {
    image: string;
    title: string;
    description: string;
  }

  interface Advantages {
    image: string;
    title: string;
    description: string;
  }

  interface Faqs {
    title: string;
    description: string;
  }

  interface Product {
    id: string;
    generaltitle: string;
    generaldescription: string;
    title: string;
    price: number;
    currency: string;
    image: string;
    description: string;
    category: string;
    banner: string;
    features: Feature[];
    advantages: Advantages[];
    faqs: Faqs[];
  }

  const { id } = useLocalSearchParams();
  const { data, isFetching } = useQuery({
    queryKey: ["productsById"],
    gcTime: 0,
    queryFn: () => getProductsById(id as string),
  });

  useFocusEffect(
  useCallback(() => {
    const onBack = () => {
      router.push("/home"); // Redirige a home directamente
      return true;
    };

    if (Platform.OS === 'android') {
      BackHandler.addEventListener("hardwareBackPress", onBack);
    }

    return () => {
      if (Platform.OS === 'android') {
        BackHandler.removeEventListener("hardwareBackPress", onBack);
      }
    };
  }, [])
);


  const product = data as unknown as Product;
  const { openModalWithParams } = useModalPayment();
  const dispatch = useDispatch();

  const { colors } = useTheme<ThemeCustom>();

  const modalRequiredPassword = useAppSelector((state) => {
    return state.modalPasswordRequired.isModalVisible;
  });

  if (!data || (isFetching && !modalRequiredPassword)) {
    dispatch(setLoading(true));
    return <View style={{ flex: 1, backgroundColor: "black" }}></View>;
  } else {
    dispatch(setLoading(false));

    const { colors } = useTheme<ThemeCustom>();

    const { themeMode } = useDarkModeTheme();

    return (
      <>
        <ScrollView
          style={{ ...styles.container, backgroundColor: colors.background }}
        >
          <HeaderEncrypted iconBack={PRODUCT_TAB_ROUTES.PRODUCT_TAB_INDEX} />
          <View
            style={{
              ...styles.centeredView,
              backgroundColor: colors.background,
            }}
          >
            <View style={styles.imageBackgroundContainer}>
              <ImageBackground
                source={{ uri: product.banner }}
                style={styles.imageBackground}
                resizeMode="cover"
              />
            </View>

            <View
              style={{
                ...styles.descriptionCard,
                backgroundColor: colors.backgroundSecondary,
              }}
            >
              <Text
                allowFontScaling={false}
                style={{ ...styles.mainTitle, color: colors.primaryText }}
              >
                {product.generaltitle}
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  ...styles.mainDescription,
                  color: colors.secondaryText,
                }}
              >
                {product.generaldescription}
              </Text>
            </View>

            <View style={{ ...styles.cardContainer, ...styles.phoneContainer }}>
              <View
                style={{
                  ...styles.innerContainer,
                  backgroundColor: colors.backgroundSecondary,
                }}
              >
                <View style={styles.productImageContainer}>
                  <ImageBackground
                    style={styles.productImage}
                    source={{ uri: product.image }}
                    resizeMode="contain"
                  />
                </View>
                <Text
                  allowFontScaling={false}
                  style={{ ...styles.productName, color: colors.primaryText }}
                >
                  {product.title}
                </Text>
                <Text
                  allowFontScaling={false}
                  style={{
                    ...styles.productPrice,
                    color: colors.secondaryText,
                  }}
                >
                  {t("pages.home-tab.from")} ${product.price} {product.currency}
                </Text>

                <View style={styles.buttonContainer}>
                  <TouchableHighlight>
                    <Button
                      size="small"
                      onClick={() =>
                        openModalWithParams(product.id, themeMode, "es")
                      }
                      variant="primary"
                    >
                      {t("pages.home-tab.buy")}
                    </Button>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 30 }}>
            {Array.isArray(product.features) && product.features.length > 0 ? (
              <CarouselFeatures features={product.features} />
            ) : null}
          </View>
          <Text
            allowFontScaling={false}
            style={{ ...styles.sectionDescription, color: colors.primaryText }}
          >
            Protege tu comunicación de principio a fin con soluciones en
            seguridad de grado militar
          </Text>
          {product.advantages?.length > 0 &&
            product.advantages.map((advantage) => {
              return (
                <CardInfo
                  key={advantage.title}
                  title={advantage.title}
                  description={advantage.description}
                  imageSource={advantage.image as ImageSourcePropType}
                />
              );
            })}

          <View style={{ marginBottom: "30%" }}>
            {product.faqs?.length > 0 && <FAQAccordion data={product.faqs} />}
          </View>
        </ScrollView>
        <View
          style={{
            ...styles.floatingContainer,
            backgroundColor: colors.backgroundSecondary,
          }}
        >
          <ImageBackground
            style={styles.floatingImage}
            source={{ uri: product.image }}
            resizeMode="contain"
          />

          <View style={styles.floatingTextContainer}>
            <Text
              allowFontScaling={false}
              style={{ ...styles.floatingTitle, color: colors.primaryText }}
            >
              {product.title}
            </Text>
            <Text
              allowFontScaling={false}
              style={{ ...styles.floatingPrice, color: colors.secondaryText }}
            >
              {t("pages.home-tab.from")} ${product.price} {product.currency}
            </Text>
          </View>
          <View style={styles.floatingButtonContainer}>
            <Button
              size="small"
              customStyles={{ fontSize: 10 }}
              onClick={() => openModalWithParams(product?.id, themeMode, "es")}
              variant="primary"
            >
              {t("pages.home-tab.buy")}
            </Button>
          </View>
        </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
  webviewContainer: {
    flex: 1,
    alignSelf: "stretch",
  },
  imageBackgroundContainer: {
    width: "100%",
    height: 200,
    backgroundColor: theme.colors.darkBlack01,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  descriptionCard: {
    width: "100%",
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,

    borderRadius: 10,
    marginBottom: 20,
  },
  floatingContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 100,

    alignItems: "center",
    position: "absolute",
    bottom: 0,
    paddingHorizontal: 15,
  },
  floatingImage: {
    width: 40,
    height: 40,
  },
  floatingTextContainer: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 10,
  },
  floatingTitle: {
    color: "white",
    fontWeight: "bold",
  },
  floatingPrice: {
    color: "white",
    fontWeight: "300",
  },
  floatingButtonContainer: {
    width: 95,
  },
  buttonText: {
    color: "white",
    fontSize: 24,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
  },
  cardContainer: {
    width: "50%",
  },
  phoneContainer: {
    width: "100%",
  },
  innerContainer: {
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  productImageContainer: {
    marginTop: 20,
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productName: {
    marginTop: 15,
    fontWeight: "700",
  },
  productPrice: {
    color: theme.lightMode.colors.white,
    fontWeight: "300",
    padding: 10,
  },
  buttonContainer: {
    width: "60%",
    marginTop: 2,
    marginBottom: 15,
  },
  mainTitle: {
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  mainDescription: {
    color: "#B1B1B1",
    textAlign: "center",
  },
  sectionTitle: {
    color: "#E3F8FF",
    fontSize: 18,
    textAlign: "center",
    marginTop: 25,
    marginBottom: 25,
  },
  sectionDescription: {
    color: "#FFFFFF",
    fontSize: 20,
    alignSelf: "center",
    fontWeight: "700",
    marginTop: 50,
    marginBottom: 15,
    width: 350,
  },
  textInformation: {
    color: theme.colors.mainActionState,
    marginTop: 15,
    marginBottom: 20,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    height: "auto",
  },
  centeredView: {
    flex: 1,
    width: "90%",
    alignSelf: "center",
  },
  goBackToProducts: {
    alignSelf: "center",
    textAlign: "center",
    color: "#FFFF",
    marginBottom: 20,
    textDecorationLine: "underline",
  },
});

export default ProductPage;
