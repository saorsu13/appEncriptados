import React from "react";
import { View, Text, StyleSheet } from "react-native";
import IconSvg from "@/components/molecules/IconSvg/IconSvg"; // ✅ Importamos el Icono correcto
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type Props = {
  totalData?: string; 
  format?: string; 
  region?: string; 
};

const DataBalanceCard = ({ totalData = "0", format = "mb", region = "REGIÓN" }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>DATOS MÓVILES</Text>

      <View style={styles.content}>
        <View style={styles.leftSection}>
          <IconSvg type="wifi" height={30} width={30} color="#00AEEF" />
          <Text style={styles.dataText}>
            {totalData} {format.toUpperCase()}
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.rightSection}>
          <Icon name="earth" size={24} color="white" />
          <Text style={styles.regionText}>{region.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    padding: 25,
    borderRadius: 15,
    borderColor: "#00AEEF",
    borderWidth: 1,
    marginBottom: 20,
    width: "100%",
  },
  title: {
    color: "white",
    fontSize: 10,
    fontWeight: "300",
    textTransform: "uppercase",
    marginBottom: 15,
    marginTop: -15,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  dataText: {
    color: "#FFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  separator: {
    width: 1,
    height: "100%",
    backgroundColor: "gray",
    marginHorizontal: 15,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  regionText: {
    color: "white",
    fontSize: 14,
    marginLeft: 10,
  },
});

export default DataBalanceCard;