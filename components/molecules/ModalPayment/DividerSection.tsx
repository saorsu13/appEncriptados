import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DividerSection = ({ label, value }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text allowFontScaling={false} style={styles.label}>
          {label}
        </Text>
        <Text allowFontScaling={false} style={styles.value}>
          {value}
        </Text>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 20,
  },
  label: {
    color: "#FFFF",
    fontWeight: "400",
  },
  value: {
    color: "#FFFF",
    fontWeight: "400",
  },
  divider: {
    borderWidth: 0.5,
    marginTop: 5,
    borderBottomColor: "#393939",
    width: "100%",
    marginBottom: 10,
  },
});

export default DividerSection;
