import Button from "@/components/atoms/Button/Button";
import Label from "@/components/atoms/Label/Label";
import React, { useState } from "react";
import { Modal, View, StyleSheet, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import theme from "@/config/theme";
import { useSelector } from "react-redux";
import { router } from "expo-router";

import IconSvg from "../IconSvg/IconSvg";

type props = {
  modalVisible: boolean;
  closeModal: () => void;
  deleteSim: () => void;
};

const DeleteSimModal = ({ modalVisible, closeModal, deleteSim }: props) => {
  const { t } = useTranslation();
  const baseMsg = "pages.deleteSimModal";
  const currentSim = useSelector((state: any) => state.sims.currentSim);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteSim();
      closeModal();
    } catch (err) {
      console.error("❌ Error al eliminar la SIM:", err);
    } finally {
      setIsDeleting(false);
    }
  };
  

  const handleCancel = () => {
    closeModal();
  };

  return (
    <View style={styles.centeredView}>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.containerHeader}>
                  <IconSvg
                    height={50}
                    width={50}
                    type="verificationiconfailed"
                  />
                  <Label
                    label={`${t(`${baseMsg}.deleteTitle`)} ${
                      currentSim?.simName
                    }?`}
                    variant="strong"
                    customStyles={styles.textLabel}
                  />
                  <Label
                    label={currentSim?.simName || ""}
                    variant="strong"
                    customStyles={styles.sinName}
                  />
                </View>
                <View style={styles.container}>
                  {isDeleting ? (
                              <ActivityIndicator size="small" color="#D32F2F" style={{ marginTop: 10 }} />
                            ) : (
                  <Button
                    onClick={handleDelete}
                    customStyles={[styles.buttonPrimary]}
                    variant="delete"
                  >
                    {t(`${baseMsg}.deleteSim`)}
                  </Button>
                  )}
                  <Button
                    onClick={handleCancel}
                    customStyles={[styles.buttonPrimary]}
                    variant="dark"
                  >
                    {t(`${baseMsg}.cancel`)}
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DeleteSimModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "transparent",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 40,
    alignItems: "center",
    elevation: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 40,
  },
  modalContainer: {
    display: "flex",
    gap: 5,
    width: "100%",
  },
  modalContent: {
    backgroundColor: theme.colors.darkBlack01,
    borderColor: theme.colors.darkBlack05,
    borderRadius: 24,
    borderWidth: 0.5,
    display: "flex",
    gap: 15,
    padding: 20,
  },
  textLabel: {
    color: theme.colors.contrast,
    textAlign: "center",
  },
  sinName: {
    ...theme.textVariants.small,
    //color:theme.colors.darkBlack06
  },
  containerHeader: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    marginBottom: 20,
  },
  container: {
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  buttonPrimary: {
    fontFamily: theme.textVariants.button.fontFamily,
  },
});
