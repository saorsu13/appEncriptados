import { StyleSheet } from "react-native";

export const deleteSimButtonStyles = StyleSheet.create({
  button: {
    borderColor: "rgba(255, 59, 48, 0.5)",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  text: {
    color: "#E50707",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});