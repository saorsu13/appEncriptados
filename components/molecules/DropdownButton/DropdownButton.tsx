import theme from "@/config/theme";
import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

const DropdownButton = ({
  open,
  setOpen,
  value,
  setValue,
  setItems,
  items,
}) => {
  return (
    <DropDownPicker
      listMode="SCROLLVIEW"
      placeholder="Seleccionar item"
      placeholderStyle={{ color: "white" }}
      style={{ backgroundColor: "#1D1D1D" }}
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      labelStyle={{ color: theme.lightMode.colors.white }}
      listItemContainerStyle={{ backgroundColor: "#333333" }}
      listItemLabelStyle={{ color: "white" }}
      dropDownStyle={{ backgroundColor: "#1D1D1D", borderColor: "#1D1D1D" }}
      //@ts-ignore
      arrowIconStyle={{ tintColor: theme.lightMode.colors.white }}
      selectedItemLabelStyle={{ color: theme.lightMode.colors.white }}
    />
  );
};

export default DropdownButton;
