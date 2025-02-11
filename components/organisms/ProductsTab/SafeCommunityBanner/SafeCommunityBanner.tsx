import React from "react";
import { ImageBackground, StyleSheet, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const SafeCommunityBanner = ({
  title,
  subtitle,
  description,
  icon,
  background,
}) => {
  return (
    <ImageBackground
      source={background}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text allowFontScaling={false} style={styles.textTitle}>
          {title}
        </Text>
        <Text allowFontScaling={false} style={styles.textSubtitle}>
          {subtitle}
        </Text>

        {icon}
        <Text allowFontScaling={false} style={styles.textDescription}>
          {description}
        </Text>
        <View style={{ marginTop: 6 }}></View>
      </View>
    </ImageBackground>
  );
};

export default SafeCommunityBanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    paddingVertical: 70,
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    zIndex: 1,
  },
  content: {
    flex: 1,
    rowGap: 8,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  textTitle: {
    textAlign: "center",
    fontSize: 20,
    color: "#E3F8FF",
    fontWeight: "400",
  },

  textSubtitle: {
    textAlign: "center",
    fontSize: 44,
    color: "#10B4E7",
    fontWeight: "700",
  },
  textDescription: {
    width: 280,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "400",
    color: "#E3F8FF",
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 3,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 3,
  },
});
