import React from "react";
import { View, StyleSheet, Image } from "react-native";
import ListOfProductCards from "@/components/molecules/CardProductItem/ListOfProductCards";
import GradientBanner from "@/components/molecules/GradientBanner/GradientBanner";
import PhoneMock from "@/components/molecules/CardProductItem/PhoneMock";
import { getProducts } from "@/api/productsTab";
import { useQuery } from "@tanstack/react-query";
import SkeletonGrid from "@/components/molecules/SkeletonContent/SkeletonGrid";

const ProductsPhoneSection = () => {
  const { data: productsPhone, isFetching } = useQuery({
    queryKey: ["productsPhone"],
    gcTime: 0,
    queryFn: () => getProducts("mobile"),
  });

  const AplicationsBanner = require("@/assets/images/phoneban.png");

  return (
    <>
      <View style={{ marginBottom: 0, width: "100%" }}>
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
      </View>
      <View style={{ width: "100%", alignSelf: "center" }}>
        {isFetching ? (
          <View style={{ flex: 1, alignSelf: "center" }}>
            <SkeletonGrid
              heightImage={95}
              widthImage={100}
              borderRadius={5}
              gap={12}
              columns={1}
              rows={2}
              boneColor="rgba(255, 255, 255, 0.25)"
            />
          </View>
        ) : Array.isArray(productsPhone) && productsPhone.length > 0 ? (
          <ListOfProductCards
            heightImage={150}
            widthImage={150}
            list={productsPhone as []}
            type={"phone"}
          />
        ) : null}
      </View>
    </>
  );
};

export default ProductsPhoneSection;

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
