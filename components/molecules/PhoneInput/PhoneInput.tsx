import React, { ReactNode, useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, TextInput } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import theme from "@/config/theme";

import IconSvg from "../IconSvg/IconSvg";
import {
  countriesPhone,
  getCountryFlagByCode,
} from "@/components/organisms/SimCountry/countries";

type props = {
  label?: string;
  value?: {
    countryCode: string;
    phoneNumber: string;
    countryPhoneCode: string;
  };
  onChange?: (any) => void;
  placeholder?: string;
  resetValue?: string;
  disabled?: boolean;
  rangeMin?: number;
  rangeMax?: number;
  styles?: {
    backgroundColor: string | null;
    borderColor: string | null;
    color: string | null;
    backgroundColorModal: string | null;
  };
  countryCode?: string;
};

const PhoneInput = ({
  value,
  onChange,
  disabled = false,
  rangeMin = 7,
  rangeMax = 12,
  styles = {
    backgroundColor: null,
    borderColor: null,
    color: null,
    backgroundColorModal: null,
  },
}: props) => {
  if (rangeMin >= rangeMax) {
    throw new Error("rangeMin must be less than rangeMax");
  }

  const [selectedValue, setSelectedValue] = useState(
    `${value.countryCode}-${value.countryPhoneCode}`
  );

  useEffect(() => {
    setSelectedValue(`${value.countryCode}-${value.countryPhoneCode}`);
    setPhoneNumber(value.phoneNumber ?? "");
  }, [value.countryCode, value.countryPhoneCode, value.phoneNumber]);

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState(countriesPhone);

  const [phoneNumber, setPhoneNumber] = useState(value.phoneNumber ?? "");
  const editable = !disabled;
  const success =
    (phoneNumber.length ?? 0) >= rangeMin &&
    (phoneNumber.length ?? 0) <= rangeMax;

  const handleValue = (val) => {
    setSelectedValue(val);
    if (onChange)
      onChange({
        countryCode: val.split("-")[0],
        countryPhoneCode: val.split("-")[1],
        phoneNumber: phoneNumber,
        success,
      });
  };

  const handleNumber = (val) => {
    if (val.length <= rangeMax) {
      setPhoneNumber(val);
      if (onChange)
        onChange({
          countryCode: selectedValue.split("-")[0],
          countryPhoneCode: selectedValue.split("-")[1],
          phoneNumber: val,
          success: val.length >= rangeMin && val.length <= rangeMax,
        });
    }
  };

  const colors = {
    backgroundColor: styles.backgroundColor
      ? styles.backgroundColor
      : theme.colors.complementaryText,
    borderColor: styles.borderColor
      ? styles.borderColor
      : theme.colors.borderInput,
    color: styles.color ? styles.color : theme.colors.smootText,
    backgroundColorModal: styles.backgroundColorModal
      ? styles.backgroundColorModal
      : theme.colors.darkBlack01,
  };

  return (
    <View
      style={[
        inputStyles.container,
        {
          borderColor: colors.borderColor,
          backgroundColor: colors.backgroundColor,
          // opacity: editable?1:.5
        },
      ]}
      aria-label="dropdown"
    >
      <View style={inputStyles.pickerWrapper}>
        <DropDownPicker
          placeholder={""}
          open={open}
          value={selectedValue}
          items={options}
          setOpen={setOpen}
          setValue={setSelectedValue}
          onChangeValue={(val) => handleValue(val)}
          style={[
            inputStyles.picker,
            {
              backgroundColor: colors.backgroundColor,
              height: 100,
              display: "flex",
              alignItems: "center",
              top: -25,
            },
          ]}
          textStyle={[inputStyles.pickerItem, { color: colors.color }]}
          labelStyle={[
            inputStyles.pickerItem,
            { position: "absolute", color: "rgba(0,0,0,0)" },
          ]}
          containerStyle={[inputStyles.pickerContainerItems]}
          containerProps={{
            style: [
              inputStyles.pickerContainerItems,
              {
                backgroundColor: colors.backgroundColor,
                opacity: editable ? 1 : 0.5,
              },
            ],
          }}
          // modalTitleStyle={{backgroundColor:"red"}}
          showArrowIcon={true}
          ArrowUpIconComponent={({ style }) => <></>}
          ArrowDownIconComponent={({ style }) => <></>}
          listMode="MODAL"
          modalProps={{
            animationType: "fade",
          }}
          modalContentContainerStyle={{
            backgroundColor: colors.backgroundColorModal,
          }}
          CloseIconComponent={() => (
            <IconSvg
              height={25}
              type="closeicon"
              width={25}
              color={colors.color}
            />
          )}
          disabled={!editable}
        />
        <View
          style={{
            position: "absolute",
            top: 12,
            right: 5,
            zIndex: 1,
            pointerEvents: "none",
            opacity: editable ? 1 : 0.5,
          }}
        >
          <IconSvg
            height={25}
            width={25}
            type="arrowupicon"
            color={colors.color}
          />
        </View>
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingRight: 10,
          opacity: editable ? 1 : 0.5,
        }}
      >
        <IconSvg height={15} width={15} type="sim" color={colors.color} />
      </View>
      <TextInput
        value={phoneNumber ?? ""}
        style={[
          inputStyles.input,
          {
            color: colors.color,
            opacity: editable ? 1 : 0.5,
          },
        ]}
        inputMode="numeric"
        allowFontScaling={false}
        onChangeText={handleNumber}
        editable={editable}
      />
    </View>
  );
};

export default PhoneInput;

const inputStyles = StyleSheet.create({
  container: {
    display: "flex",
    // gap: 15,
    zIndex: 10,
    width: "100%",
    flexDirection: "row",
    borderColor: theme.colors.borderSelect,
    borderRadius: 8,
    color: theme.colors.selectText,
    borderWidth: 0.5,
    height: 50,
    backgroundColor: theme.colors.darkBlack01,
    overflow: "hidden",
  },
  label: {
    paddingVertical: 2.5,
    color: theme.colors.selectLabel,
    ...theme.textVariants.descriptionCard,
  },
  picker: {
    backgroundColor: "rgba(0,0,0,0)",
    borderWidth: 0,
    paddingHorizontal: 5,
    paddingVertical: 8,
    ...theme.textVariants.select,
    zIndex: 10,
  },
  pickerItem: {
    color: theme.colors.selectText,
    ...theme.textVariants.select,
  },
  pickerContainerItems: {
    backgroundColor: theme.colors.darkBlack01,
  },
  input: {
    height: 18,
    // borderRadius: 14,
    borderWidth: 0,
    // backgroundColor: "red",
    // color: theme.colors.smootText,
    minHeight: 48,
    paddingHorizontal: 0,
    paddingVertical: 10,
    ...theme.textVariants.input,
    width: "60%",
  },
  pickerWrapper: {
    width: 70,
    paddingLeft: 10,
    height: 40,
    overflow: "hidden",
    justifyContent: "center",
    flexDirection: "row",
  },
  statusSucess: {
    color: theme.colors.inputStatusSuccess,
    ...theme.textVariants.descriptionCard,
  },
});
