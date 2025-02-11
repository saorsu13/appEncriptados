import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import IconSvg from "../IconSvg/IconSvg";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import { t } from "i18next";

const AccordionItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  const { colors } = useTheme<ThemeCustom>();

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity
        onPress={toggleExpand}
        style={{
          ...styles.accordionHeader,
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.strokeBorder,
          borderWidth: 2,
        }}
      >
        <Text
          allowFontScaling={false}
          style={{
            ...styles.accordionTitle,
            color: colors.primaryText,
          }}
        >
          {item.title}
        </Text>
        <Animated.View
          style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}
        >
          <IconSvg type="arrowupicon" />
        </Animated.View>
      </TouchableOpacity>
      {expanded && (
        <View
          style={{
            ...styles.accordionContent,
            backgroundColor: colors.backgroundSecondary,
          }}
        >
          <Text allowFontScaling={false} style={{ color: colors.primaryText }}>
            {item.content}
          </Text>
        </View>
      )}
    </View>
  );
};

const FAQAccordion = ({ data }) => {
  const { colors } = useTheme<ThemeCustom>();
  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <Text
        allowFontScaling={false}
        style={{ ...styles.header, color: colors.primaryText }}
      >
        {t("pages.home-tab.frequentQuestions")}
      </Text>
      {data.map((item, index) => (
        <AccordionItem key={index} item={item} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  accordionItem: {
    marginBottom: 10,
    borderRadius: 15,
  },
  accordionHeader: {
    padding: 15,
    borderRadius: 15,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accordionTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
  },
  accordionContent: {
    padding: 15,
    borderRadius: 15,
    marginTop: 5,
  },
});

export default FAQAccordion;
