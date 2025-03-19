import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  selectorContainer: {
    width: "45%",
    minHeight: 50, // 📌 Asegura que todos tengan el mismo alto
  },
  currencyContainer: {
    width: "50%",
    minHeight: 50, // 📌 Hace que el tamaño coincida con selectorContainer
    justifyContent: "center", // 📌 Alinea los elementos correctamente
  },
  currencyWrapper: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 40,
  },
  label: {
    color: "gray",
    fontSize: 14,
    marginBottom: 5,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161616",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "space-between",
    flex: 1,
    minHeight: 50, // 📌 Ajusta el alto del selector
  },
  selectorContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectorText: {
    color: "white",
    fontSize: 15,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  flagContainer: {
    marginLeft: 10,
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 50,
  },
  currencyFlag: {
    width: 28,
    height: 20,
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
    backgroundColor: "#121212",
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    color: "white",
    fontSize: Platform.OS === "ios" ? 15 : 16,
    fontWeight: "500",
    marginBottom: 15,
  },
  simItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
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
    backgroundColor: "#363636",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  simName: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  simNumber: {
    color: "#1E1E1E",
    fontSize: 14,
    marginLeft: 15,
    fontWeight: "bold",
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
  currencyText: {
    color: "white",
    fontSize: 16,
    fontWeight: "normal",
    marginLeft: 10,
  },
  currencyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    marginBottom: 10,
  },
});
