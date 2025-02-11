import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const PaymentOption = ({ option, activeOption, setActiveOption }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setActiveOption(option.value);
      }}
      style={styles.optionContainer}
    >
      <View style={styles.iconContainer}>{option.icon}</View>
      <Text
        style={{
          textAlign: "center",
          color: activeOption === option.value ? "#FFFFFF" : "#B3B3B3",
          marginTop: 7,
        }}
      >
        {option.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    width: "49%",
    height: 100,
    borderColor: "#202020",
    borderWidth: 2,
    backgroundColor: "#202020",
    justifyContent: "center",
    marginBottom: 10,
    borderRadius: 6,
    padding: 3,
  },
  iconContainer: {
    alignSelf: "center",
  },
});

export default PaymentOption;
