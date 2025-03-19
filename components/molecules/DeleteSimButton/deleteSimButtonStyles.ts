import { StyleSheet } from "react-native";

export const deleteSimButtonStyles = StyleSheet.create({
  button: {
    backgroundColor: "rgba(255, 59, 48, 0.2)", // Fondo oscuro con opacidad
    borderColor: "#E50707", // Borde rojo vibrante
    borderWidth: 1,
    borderRadius: 10, // Bordes redondeados
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "flex-start", // 📌 Asegurar que el contenido se alinee a la izquierda
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // 📌 Asegurar que el icono y texto estén alineados a la izquierda
  },
  text: {
    color: "#E50707", // Color rojo vibrante
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8, // Espaciado entre el icono y el texto
  },
});