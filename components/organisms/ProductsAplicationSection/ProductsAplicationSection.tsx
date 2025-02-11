import React from "react";
import { View, StyleSheet, Image } from "react-native";
import ListOfProductCards from "@/components/molecules/CardProductItem/ListOfProductCards";
import GradientBanner from "@/components/molecules/GradientBanner/GradientBanner";

import { useQuery } from "@tanstack/react-query"; // Importa useQuery desde el paquete correcto
import { getProducts } from "@/api/productsTab";
import SkeletonGrid from "@/components/molecules/SkeletonContent/SkeletonGrid";
import { t } from "i18next";

const ProductsSimSection = () => {
  const { data: productsApp, isFetching } = useQuery({
    queryKey: ["productsSim"],
    gcTime: 0, // Cambiado gcTime por cacheTime
    queryFn: () => getProducts("app"),
  });

  const stepData = [
    { imageSource: undefined, stepNumber: 1, title: t("pages.home-tab.buyIt") },
    ,
    {
      imageSource: undefined,
      stepNumber: 2,
      title: t("pages.home-tab.receiveIt"),
    },
    {
      imageSource: undefined,
      stepNumber: 3,
      title: t("pages.home-tab.activateIt"),
    },
  ];

  const AplicationsBanner = require("@/assets/images/appban.png");

  return (
    <>
      <View
        style={{
          marginBottom: 40,
          justifyContent: "center",
          flex: 1,
          alignItems: "center",
        }}
      >
        <Image
          source={AplicationsBanner}
          resizeMode="cover"
          style={styles.image}
        />
      </View>

      <View>
        {isFetching ? (
          <View style={{ flex: 1, alignSelf: "center" }}>
            <SkeletonGrid
              heightImage={300}
              widthImage={200}
              borderRadius={5}
              gap={12}
              columns={2}
              rows={2}
              boneColor="rgba(255, 255, 255, 0.25)"
            />
          </View>
        ) : (
          Array.isArray(productsApp) &&
          productsApp.length > 0 && (
            <View style={styles.container}>
              <ListOfProductCards
                heightImage={70}
                widthImage={70}
                list={productsApp as []}
                type={"product"}
              />
            </View>
          )
        )}
      </View>
    </>
  );
};

export default ProductsSimSection;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 120,
  },
  image: {
    borderRadius: 10,
    width: "95%",
    height: 200,
  },
});
