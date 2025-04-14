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
});
