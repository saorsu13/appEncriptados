import React from "react";
import { TextInput, StyleSheet } from "react-native";

const FormPaymentInput = ({
  placeholder,
  handleChange,
  handleBlur,
  value,
  width,
}) => {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#656565"
      style={{ ...styles.input, width: width }}
      onChangeText={handleChange}
      onBlur={handleBlur}
      value={value}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 33,
    borderWidth: 0.2,
    backgroundColor: "#202020",
    borderColor: "#CCCCCC",
    borderRadius: 3,
    paddingHorizontal: 12,
  },
});

export default FormPaymentInput;
