import { StyleSheet } from "react-native";

export const balanceStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191919",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10, // 🔹 Menos espacio arriba
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#3A3A3A", // 🔹 Línea separadora gris claro
    marginVertical: 10,
    marginTop: 25,
  },
  
});
