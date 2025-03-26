
import { StyleSheet } from "react-native";

export const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? "#121212" : "#E6F9FF",
      padding: 25,
      borderRadius: 15,
      borderColor: "#00AEEF",
      borderWidth: 1,
      marginBottom: 20,
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
    },
    regionText: {
      color: isDarkMode ? "#FFFFFF" : "#1E1E1E",
      fontSize: 14,
      marginLeft: 10,
    },
  });