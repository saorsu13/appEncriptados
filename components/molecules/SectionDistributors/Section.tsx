import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";

interface SectionProps {
  title?: string;
  text?: string;
  imageSource?: ImageSourcePropType;
}

const Section: React.FC<SectionProps> = ({ title, text, imageSource }) => {
  const { colors } = useTheme<ThemeCustom>();

  return (
    <View style={styles.container}>
      {title && (
        <Text
          allowFontScaling={false}
          style={[styles.title, { color: colors.primaryText }]}
        >
          {title}
        </Text>
      )}
      {text && (
        <View style={styles.textContainer}>
          <Text
            allowFontScaling={false}
            style={[styles.text, { color: colors.secondaryText }]}
          >
            {text}
          </Text>
        </View>
      )}
      {imageSource && (
        <Image source={imageSource} resizeMode="cover" style={styles.image} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "justify",
  },
  image: {
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
    height: 250,
    borderRadius: 10,
  },
  textContainer: {
    padding: 10,
  },
});

export default Section;
