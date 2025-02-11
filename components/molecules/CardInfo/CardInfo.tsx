import { ThemeCustom } from "@/config/theme2";
import { useTheme } from "@shopify/restyle";
import React, { ReactElement } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";

interface CardInfoProps {
  imageSource?: ImageSourcePropType;
  vectorComponent?: ReactElement;
  description?: string;
  title: string;
  titleColor?: string;
  descriptionColor?: string;
}

const CardInfo: React.FC<CardInfoProps> = ({
  imageSource,
  vectorComponent,
  description,
  title,
  titleColor = "#FFF",
  descriptionColor = "#FFF",
}) => {
  const { colors } = useTheme<ThemeCustom>();
  return (
    <View style={styles.cardContainer}>
      <View
        style={{
          ...styles.innerContainer,
          backgroundColor: colors.backgroundSecondary,
        }}
      >
        <View style={styles.topRow}>
          {imageSource ? (
            typeof imageSource === "string" ? (
              <View
                style={{
                  backgroundColor: colors.backgroundAlternate2,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Image source={{ uri: imageSource }} style={styles.image} />
              </View>
            ) : (
              <Image source={imageSource} style={styles.image} />
            )
          ) : (
            <View style={styles.vectorContainer}>{vectorComponent}</View>
          )}
          <Text
            allowFontScaling={false}
            style={[styles.titleText, { color: colors.primaryText }]}
          >
            {title}
          </Text>
        </View>
        {description && (
          <View style={styles.bottomRow}>
            <Text
              allowFontScaling={false}
              style={[styles.descriptionText, { color: colors.secondaryText }]}
            >
              {description}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    padding: 10,
  },
  innerContainer: {
    padding: 20,
    borderRadius: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomRow: {
    marginTop: 10,
  },
  image: {
    width: 35,
    height: 35,
    borderRadius: 10,
  },
  vectorContainer: {
    backgroundColor: "#0C3441",
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  titleText: {
    flex: 1,
    color: "white",
    fontSize: 14,
    padding: 5,
    marginLeft: 10,
  },
  descriptionText: {
    color: "#FFFFFF",
    fontSize: 14,
    padding: 5,
  },
});

export default CardInfo;
