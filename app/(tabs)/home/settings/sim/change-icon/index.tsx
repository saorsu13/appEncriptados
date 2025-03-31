import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import { ThemeCustom } from "@/config/theme2";
import { useTheme } from "@shopify/restyle";
import PinInputScreen from "@/components/molecules/PinInputScreen/PinInputScreen";
import { router } from "expo-router";

const ChangeIcon = () => {
  const { colors } = useTheme<ThemeCustom>();
  return (
    <>
      <View style={{ backgroundColor: colors.background }}>
        <HeaderEncrypted owner="app-fantasma" iconBack="home/settings/sim" />
      </View>
      <View style={styles.container}>
        <ScrollView
          style={[styles.scrollView, { backgroundColor: colors.background }]}
        >
          <View
            style={[
              styles.contentContainer,
              { backgroundColor: colors.backgroundAlternate },
            ]}
          >
            <Text
              allowFontScaling={false}
              style={[styles.primaryText, { color: colors.primaryText }]}
            >
              Cambiar icono de aplicación
            </Text>
            <Text
              allowFontScaling={false}
              style={[styles.secondaryText, { color: colors.secondaryText }]}
            >
              Para mantener al máximo tu privacidad puedes cambiar el ícono que
              aparece en el homescreen tu smartphone
            </Text>
            <TouchableOpacity
              onPress={() => {
                /* Acción al hacer clic */
              }}
            >
              <Text
                allowFontScaling={false}
                style={[styles.underlineText, { color: colors.primaryText }]}
              >
                ¿Cómo funciona?
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: "90%", alignSelf: "center", flex: 1 }}>
            <Text allowFontScaling={false} style={{ color: colors.white }}>
              Seleccionar el icono
            </Text>
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          ...styles.buttonContainer,
          backgroundColor: colors.background,
        }}
      ></View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredTextContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  centeredText: {
    fontSize: 18,
    width: 250,
    fontWeight: "bold",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: "90%",
    borderRadius: 10,

    alignSelf: "center",
    marginBottom: 20,
  },
  primaryText: {
    marginVertical: 10,
  },
  secondaryText: {
    marginVertical: 10,
  },
  underlineText: {
    marginVertical: 10,
    textDecorationLine: "underline",
  },
  buttonContainer: {
    padding: 10,

    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  button: {
    width: "100%",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChangeIcon;
