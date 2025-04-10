import { StyleSheet, Platform } from "react-native";

export const topUpCardStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 15,
    padding: Platform.OS === "ios" ? 20 : 15,
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
    width: "100%",
    height: Platform.OS === "ios" ? 150 : 130,
    overflow: "hidden",
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
    maxWidth: Platform.OS === "ios" ? "65%" : "60%",
    paddingLeft: Platform.OS === "ios" ? 10 : 0,
    paddingTop: Platform.OS === "ios" ? 5 : 0,
    paddingBottom: Platform.OS === "ios" ? 5 : 0, 
    flexShrink: 1,
  },
  title: {
    fontSize: Platform.OS === "ios" ? 15 : 16,
    fontWeight: "800",
    color: "#000",
    flexWrap: "wrap",
    width: "100%",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#1E1E1E",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "400",
  },
  image: {
    width: Platform.OS === "ios" ? 140 : 120,
    height: Platform.OS === "ios" ? 160 : 140,
    resizeMode: "contain",
    position: "absolute",
    bottom: -5,
    right: Platform.OS === "ios" ? 5 : 10,
    top: "auto",
  },
});
