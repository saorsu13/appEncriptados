import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import IconSvg from "@/components/molecules/IconSvg/IconSvg";

type Props = {
  visible: boolean;
  simNumber: string;
  onClose: () => void;
};

const SuccessModal = ({ visible, simNumber, onClose }: Props) => {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <IconSvg type="checkcircle" width={60} height={60} color="#00C566" />
          <Text style={styles.title}>¡SIM añadida exitosamente!</Text>
          <Text style={styles.subtitle}>
            Tu SIM #{simNumber} se ha añadido a la lista de tus SIMs disponibles.
          </Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Ir a panel de control</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    padding: 24,
    backgroundColor: "#000",
    borderRadius: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
  },
  subtitle: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 12,
  },
  button: {
    backgroundColor: "#00B2FF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});