import { ThemeCustom } from "@/config/theme2";
import { useTheme } from "@shopify/restyle";
import { router } from "expo-router";
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

const ContactButton = () => {
  const { colors } = useTheme<ThemeCustom>();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          ...styles.button,
          backgroundColor: colors.backgroundAlternate2,
        }}
        onPress={() => {
          router.push("home-tab/distributors/sign-up-distributors");
        }}
      >
        <Text
          allowFontScaling={false}
          style={{ ...styles.buttonText, color: colors.primaryText }}
        >
          Inscribirme
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    alignSelf: "center",
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    color: "#000",
  },
});

export default ContactButton;
