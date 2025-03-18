import { StyleSheet } from "react-native";

export const deleteSimButtonStyles = StyleSheet.create({
  button: {
    backgroundColor: "rgba(255, 59, 48, 0.1)", // Fondo oscuro con opacidad
    borderColor: "#FF3B30", // Borde rojo vibrante
    borderWidth: 1,
    borderRadius: 10, // Bordes redondeados
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // Se adapta al ancho del contenedor
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#FF3B30", // Color rojo vibrante
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8, // Espaciado entre el icono y el texto
  },
});
