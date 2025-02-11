import { ThemeCustom } from "@/config/theme2";
import { useTheme } from "@shopify/restyle";
import React, { ReactElement } from "react";
import { View, Text, StyleSheet } from "react-native";
import PricingVector from "./icons/PricingVector";

interface CardInfoProps {
  imageSource?: ReactElement;
  vectorComponent?: ReactElement;
  description?: string;
  title: string;
  titleColor?: string;
  descriptionColor?: string;
  state?: ReactElement;
  background?: string;
  borderColor?: string;
}

const CardInfoStepper: React.FC<CardInfoProps> = ({
  imageSource,
  vectorComponent,
  background,
  borderColor,
  description,
  title,
  state,
  titleColor = "#FFF",
  descriptionColor = "#FFF",
}) => {
  const { colors } = useTheme<ThemeCustom>();
  return (
    <View
      style={{
        ...styles.cardContainer,
        borderColor: borderColor,
        borderWidth: borderColor ? 2 : 0,
        borderRadius: 10,
      }}
    >
      <View
        style={{
          ...styles.innerContainer,
          backgroundColor: background,
        }}
      >
        <View style={styles.topRow}>
          <View
            style={{
              backgroundColor: colors.primaryColor,
              padding: 10,
              borderRadius: 10,
            }}
          >
            {imageSource}
          </View>

          <Text
            allowFontScaling={false}
            style={[styles.titleText, { color: colors.strokeBorder }]}
          >
            {title}
          </Text>
          <View style={styles.bottomRow}>
            <Text
              allowFontScaling={false}
              style={[styles.descriptionText, { color: colors.secondaryText }]}
            >
              {description}
            </Text>
          </View>
          {state && (
            <View style={styles.priceContainer}>
              <Text
                allowFontScaling={false}
                style={[styles.priceText, { color: colors.primaryColor }]}
              >
                {state}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
  },
  innerContainer: {
    padding: 15,
    borderRadius: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomRow: {
    marginTop: 10,
  },
  priceContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  image: {
    width: 35,
    height: 35,
    borderRadius: 10,
  },
  vectorContainer: {
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  titleText: {
    flex: 1,
    fontWeight: "700",
    fontSize: 14,
    padding: 5,

    marginLeft: 10,
  },
  descriptionText: {
    color: "#FFFFFF",
    fontSize: 14,
    padding: 5,
  },
  priceText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CardInfoStepper;
