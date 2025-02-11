import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "@/components/atoms/Button/Button";
import CarouselMock from "./CarouselMock";
import { t } from "i18next";

export const CarouselItem = ({ item, index, selectedIndex }) => (
  <View style={[styles.card, index === selectedIndex && styles.selectedCard]}>
    <CarouselMock />
    <View style={styles.cardContent}>
      <Text allowFontScaling={false} style={styles.textPromo}>
        Plan de datos{" "}
      </Text>
      <Text allowFontScaling={false} style={styles.title}>
        para {item.title}
      </Text>
      <Text allowFontScaling={false} style={styles.price}>
        <View style={styles.separator}></View>
      </Text>
      <Text allowFontScaling={false} style={styles.price}>
        {item.price}
      </Text>
    </View>
    <Button
      customStyles={{ color: "#0F4457", fontSize: 16 }}
      onClick={() => {}}
      size="small"
      variant="primary"
    >
      {t("pages.home-tab.buy")}
    </Button>
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: 220,
    height: 388,
    borderRadius: 10,
    marginHorizontal: 6,
    shadowColor: "#10B4E7",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 100,
    backgroundColor: "#101010",
    padding: 20,
    justifyContent: "space-between",
    borderWidth: 0.5,
  },
  selectedCard: {
    borderColor: "#10B4E7",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "300",
    marginVertical: 10,
    textAlign: "center",
  },
  separator: {
    width: 32,
    backgroundColor: "#D9D9D9",
    height: 0.5,
  },
  price: {
    color: "#E3F8FF",
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 5,
    textAlign: "center",
  },
  textPromo: {
    fontWeight: "700",
    color: "#E3F8FF",
    textAlign: "center",
  },
});
