import { StyleSheet } from "react-native";

export const currentBalanceStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#000",
    marginTop: 10,
    borderRadius: 10,
    marginBottom: 25,
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
    color: "#FFFFFF",
  },
  balanceAmount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00FFCC", // Color del saldo
  },
  iconColor: {
    color: "#FFFFFF", // Color del ícono de la billetera
  },
  infoIcon: {
    color: "#CCCCCC", // Color del icono de información
  },
});
