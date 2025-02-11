import React, { useEffect, useState } from "react";
import { View, Switch, StyleSheet } from "react-native";
import theme from "@/config/theme";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";

type Props = {
  onChange?: (value: boolean) => void;
  defaultValue?: boolean;
  value?: boolean;
};

const CustomSwitch = ({ onChange, defaultValue = false, value }: Props) => {
  const [isEnabled, setIsEnabled] = useState(defaultValue);

  const toggleSwitch = (newValue: boolean) => {
    if (onChange) onChange(newValue);
    setIsEnabled(newValue);
  };

  const { themeMode } = useDarkModeTheme();

  useEffect(() => {
    setIsEnabled(value ?? defaultValue);
  }, [value, defaultValue]);

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{
          false: theme.colors.switchThumbFalse,
          true:
            themeMode === ThemeMode.Dark
              ? theme.colors.switchThumbTrue
              : theme.colors.mainActionState,
        }}
        thumbColor={
          isEnabled
            ? theme.colors.switchTrackTrue
            : theme.colors.switchTrackFalse // Adjusted to match "false" case
        }
        ios_backgroundColor={theme.colors.switchTrackTrue}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CustomSwitch;
