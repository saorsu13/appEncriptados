import theme from "@/config/theme";
import React, { useState } from "react";
import Switch from "@/components/atoms/Switch";
import { StyleSheet, View } from "react-native";
import Label from "@/components/atoms/Label/Label";

type props = {
  onChange?: any;
  label: string;
  defaultValue?: boolean;
  value?: boolean;
};

const SwitchCard = ({ onChange = null, label, defaultValue, value }: props) => {
  const handleChange = (e) => {
    if (onChange) onChange(e);
  };

  return (
    <View style={styles.container}>
      <Label label={label} variant="strong" customStyles={styles.label} />
      <Switch
        onChange={handleChange}
        defaultValue={defaultValue}
        value={value}
      />
    </View>
  );
};

export default SwitchCard;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: theme.colors.switchCardBG,
    width: "100%",
    borderRadius: 14,
  },
  label: {
    color: theme.colors.mainText,
  },
});
