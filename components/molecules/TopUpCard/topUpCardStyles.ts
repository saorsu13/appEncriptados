import { StyleSheet } from "react-native";

export const topUpCardStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
    width: "100%",
    height: 130,
    backgroundColor: "#7EDCFF",
    overflow: "visible",
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
    maxWidth: "60%", // 📌 Limita el espacio del texto para que no invada la imagen
    flexShrink: 1, // 📌 Permite que el texto se ajuste si es necesario
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
    flexWrap: "wrap", 
    width: "100%",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#1E1E1E",
    paddingVertical: 8,
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
    width: 120,
    height: 140,
    resizeMode: "cover",
    position: "absolute",
    bottom: 0,
    right: 10,
    top: -10,
  },
});
