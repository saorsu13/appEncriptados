import { ThemeCustom } from "@/config/theme2";
import { useTheme } from "@shopify/restyle";
import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import GradientBanner from "../GradientBanner/GradientBanner";
import CardInfoStepper from "./CardInfoStepper";
import SimIcon from "./icons/SimIcon";

const StepperCard = ({ cardinfo, vectorcomponent, stepNumber, title }) => {
  const { colors } = useTheme<ThemeCustom>();

  return (
    <GradientBanner
      height={440}
      width={"90%"}
      vertical
      colors={["#E3F8FF", "#10B4E7"]}
      title="Bienvenido"
    >
      <View style={styles.container}>
        <View style={styles.cardInfoContainer}>{cardinfo}</View>
        <View style={styles.vectorContainer}>{vectorcomponent}</View>
      </View>
    </GradientBanner>
  );
};

export default StepperCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between", // Asegura el espacio entre los elementos
    alignItems: "center",
    paddingHorizontal: 20,
  },
  cardInfoContainer: {
    marginTop: 45,
    width: "100%",
    alignItems: "center",
    height: 100, // Altura fija para mantener la posición
  },
  vectorContainer: {
    alignSelf: "center",
    height: 500, // Altura fija para mantener la posición
  },
});
