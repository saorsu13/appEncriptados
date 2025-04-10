
import { StyleSheet } from "react-native";

export const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? "#121212" : "#E6F9FF",
      padding: 25,
      borderRadius: 15,
      borderColor: "#00AEEF",
      borderWidth: 1,
      marginBottom: 15,
      width: "100%",
    },
    title: {
      color: isDarkMode ? "white" : "#1E1E1E",
      fontSize: 10,
      fontWeight: "300",
      textTransform: "uppercase",
      marginBottom: 15,
      marginTop: -15,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    leftSection: {
      flexDirection: "row",
      alignItems: "center",
    },
    dataText: {
      color: isDarkMode ? "#FFFFFF" : "#1E1E1E",
      fontSize: 24,
      fontWeight: "bold",
      marginLeft: 10,
    },
    separator: {
      width: 1,
      height: "100%",
      backgroundColor: isDarkMode ? "#666666" : "gray",
      marginHorizontal: 15,
    },
    rightSection: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      maxWidth: "55%",
    },
    textWrapper: {
      marginLeft: 10,
      flexShrink: 1,
      flexGrow: 1,
    },
    regionText: {
      color: isDarkMode ? "#FFFFFF" : "#1E1E1E",
      fontSize: 12,
      lineHeight: 16,
      flexWrap: "wrap",
    },
  });