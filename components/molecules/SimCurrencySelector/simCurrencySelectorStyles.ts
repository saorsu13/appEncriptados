import { Platform, StyleSheet } from "react-native";

export const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    selectorContainer: {
      width: "55%",
      minHeight: 50,
    },
    label: {
      color: isDarkMode ? "#CCCCCC" : "#1E1E1E",
      fontSize: 14,
      marginBottom: 5,
    },
    selector: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDarkMode ? "#161616" : "#D0EFFF",
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 15,
      justifyContent: "space-between",
      flex: 1,
      minHeight: 50,
    },
    selectorContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    selectorText: {
      color: isDarkMode ? "white" : "#1E1E1E",
      fontSize: 15,
    },
    icon: {
      width: 24,
      height: 24,
      resizeMode: "contain",
    },
    modalBackground: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      width: "85%",
      backgroundColor: isDarkMode ? "#121212" : "#E5F9FF",
      borderRadius: 15,
      padding: 20,
    },
    modalTitle: {
      color: isDarkMode ? "white" : "#1E1E1E",
      fontSize: Platform.OS === "ios" ? 15 : 16,
      fontWeight: "500",
      marginBottom: 15,
    },
    simItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDarkMode ? "#fff" : "#F7F7F7",
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
      justifyContent: "space-between",
    },
    simInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    simNameContainer: {
      backgroundColor: isDarkMode ? "#363636" : "#C6EDFF",
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginRight: 10,
    },
    simName: {
      color: isDarkMode ? "white" : "#1E1E1E",
      fontSize: 12,
      fontWeight: "bold",
    },
    simNumber: {
      color: "#1E1E1E",
      fontSize: 14,
      marginLeft: 10,
      fontWeight: "bold",
      maxWidth: 150,   
      flexShrink: 1, 
    },
    
    addSimButton: {
      backgroundColor: "#00AEEF",
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: "flex-start",
      paddingHorizontal: 15,
      marginTop: 10,
      width: "100%",
    },
    addSimText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "left",
      width: "100%",
    },
  });
