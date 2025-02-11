import React from "react";
import { ImageBackground, StyleSheet, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const WelcomeProducts = ({ title, description, icon, background }) => {
  return (
    <ImageBackground
      source={background}
      resizeMode="contain"
      style={styles.container}
    >
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.8)", "transparent"]}
        style={styles.topGradient}
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text allowFontScaling={false} style={styles.textTitle}>
          {title}
        </Text>
        {icon}
        <Text allowFontScaling={false} style={styles.textDescription}>
          {description}
        </Text>
        <View style={{ marginTop: 6 }}></View>
      </View>
      <LinearGradient
        colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
        style={styles.bottomGradient}
      />
    </ImageBackground>
  );
};

export default WelcomeProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    paddingVertical: 70,
    alignItems: "center",
    backgroundColor: "gray",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    fontSize: 28,
    color: "#E3F8FF",
    fontWeight: "700",
  },
  textDescription: {
    width: 280,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
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
