import { StyleSheet } from "react-native";

export const balanceStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#3A3A3A",
    marginVertical: 10,
    marginTop: 25,
    marginBottom: 25,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 50,
    marginBottom: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginVertical: 12,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 8,
  },
  modalButtonText: {
    fontWeight: "600",
  },
});
