import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function GradientBanner({
  colors,
  title,
  vertical = false,
  width,
  height,
  children,
}) {
  const gradientDirection = vertical
    ? { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } }
    : { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } };

  return (
    <LinearGradient
      colors={colors}
      start={gradientDirection.start}
      end={gradientDirection.end}
      style={{ ...styles.linearGradient, height: height, width: width }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#E3F8FF",
  },
});
