import React from "react";
import { Modal, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import IconSvg from "../IconSvg/IconSvg";
import { balanceStyles } from "@/(styles)/balanceStyles";

interface Props {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  simName: string | undefined;
  isDarkMode: boolean;
  t: (key: string) => string;
  baseMsg: string;
  isDeleting: boolean;
}

const DeleteSimModal: React.FC<Props> = ({
  visible,
  onClose,
  onDelete,
  simName,
  isDarkMode,
  t,
  baseMsg,
  isDeleting,
}) => {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={balanceStyles.modalOverlay}>
        <View style={[balanceStyles.modalBox, { backgroundColor: isDarkMode ? "#000" : "#fff" }]}>
          <IconSvg height={50} width={50} type="verificationiconfailed" />
          
          <Text
            style={[
              balanceStyles.modalTitle,
              {
                color: isDarkMode ? "#fff" : "#000",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 16,
                marginTop: 10,
              },
            ]}
          >
            {`${t(`${baseMsg}.deleteTitle`)} ${simName}?`}
          </Text>

          <Text
            style={{
              color: isDarkMode ? "#aaa" : "#555",
              fontSize: 14,
              textAlign: "center",
              marginTop: 6,
            }}
          >
            {simName}
          </Text>

          {isDeleting ? (
            <ActivityIndicator size="small" color="#D32F2F" style={{ marginTop: 20 }} />
          ) : (
            <TouchableOpacity
              style={[balanceStyles.modalButton, { backgroundColor: "#D32F2F", marginTop: 20 }]}
              onPress={onDelete}
            >
              <Text style={balanceStyles.modalButtonText}>
                {t(`${baseMsg}.deleteSim`)}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              balanceStyles.modalButton,
              {
                backgroundColor: isDarkMode ? "#444" : "#ccc",
                marginTop: 8,
                opacity: isDeleting ? 0.5 : 1,
              },
            ]}
            onPress={!isDeleting ? onClose : undefined}
            disabled={isDeleting}
          >
            <Text
              style={[
                balanceStyles.modalButtonText,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              {t(`${baseMsg}.cancel`)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteSimModal;