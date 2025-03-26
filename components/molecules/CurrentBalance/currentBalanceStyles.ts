import { StyleSheet } from "react-native";

export const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: isDarkMode ? "#121212" : "#D0EFFF",
      marginTop: 10,
      borderRadius: 10,
      marginBottom: 25,
      padding: 15,
      width: "100%",
    },
    balanceHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    balanceLabel: {
      fontSize: 14,
      fontWeight: "300",
      color: isDarkMode ? "#CCCCCC" : "#1E1E1E",
    },
    balanceAmount: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    balanceValue: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#00FFCC", // Este color puedes también mover a tu palette si quieres
    },
    usedDataText: {
      color: isDarkMode ? "#CCCCCC" : "#333333",
      marginTop: 5,
    },
    infoIcon: {
      color: isDarkMode ? "#CCCCCC" : "#666666",
    },
  });
