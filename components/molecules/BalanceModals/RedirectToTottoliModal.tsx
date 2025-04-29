import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import IconSvg from "../IconSvg/IconSvg";
import { resetSimState } from "@/features/sims/simSlice";
import { balanceStyles } from "@/(styles)/balanceStyles";

interface Props {
  visible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const RedirectToTottoliModal: React.FC<Props> = ({ visible, onClose, isDarkMode }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={balanceStyles.modalOverlay}>
        <View style={[balanceStyles.modalBox, { backgroundColor: isDarkMode ? "#000" : "#fff" }]}>
          <IconSvg type="checkcircle" width={60} height={60} color="#00C566" />
          <Text style={[balanceStyles.modalTitle, { color: isDarkMode ? "#fff" : "#000" }]}>
            ¿Deseas ir a la vista de Tottoli?
          </Text>
          <Text style={[balanceStyles.modalSubtitle, { color: isDarkMode ? "#ccc" : "#444" }]}>
            Esta SIM está asociada a Tottoli. Puedes ir al panel correspondiente.
          </Text>
          <TouchableOpacity
            style={[balanceStyles.modalButton, { backgroundColor: "#D32F2F" }]}
            onPress={() => {
              onClose();
              dispatch(resetSimState());
              router.replace("/(tabs)/home");
            }}
          >
            <Text style={balanceStyles.modalButtonText}>Ir al panel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              balanceStyles.modalButton,
              { backgroundColor: isDarkMode ? "#444" : "#ccc", marginTop: 8 },
            ]}
            onPress={onClose}
          >
            <Text style={[balanceStyles.modalButtonText, { color: isDarkMode ? "#fff" : "#000" }]}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RedirectToTottoliModal;