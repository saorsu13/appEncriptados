import theme from "@/config/theme";
import { ThemeMode } from "@/context/theme";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const StepList = ({ title, items }) => {
  const { themeMode } = useDarkModeTheme();
  return (
    <View
      style={[
        themeMode === ThemeMode.Dark
          ? styles.container
          : { ...styles.container, backgroundColor: "#E7E7E7" },
      ]}
    >
      <Text
        allowFontScaling={false}
        style={
          themeMode === ThemeMode.Dark
            ? styles.title
            : { ...styles.title, color: theme.colors.darkBlack }
        }
      >
        {title}
      </Text>
      {items.map((item, index) => (
        <Text
          allowFontScaling={false}
          key={`${index}-${item}`}
          style={[styles.item, styles.itemText]}
        >
          <Text allowFontScaling={false} style={styles.item}>
            {index + 1}.
          </Text>{" "}
          {item}
        </Text>
      ))}
    </View>
  );
};

export default StepList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.darkBlack03,
    borderRadius: 8,
    padding: 14,
    display: "flex",
    gap: 8,
  },
  title: {
    color: theme.colors.listTitle,
    ...theme.textVariants.titleList,
  },
  item: {
    color: theme.colors.contentSummary,
    ...theme.textVariants.titleList,
  },
  itemText: {
    fontFamily: theme.textVariants.captionCard.fontFamily,
  },
});
