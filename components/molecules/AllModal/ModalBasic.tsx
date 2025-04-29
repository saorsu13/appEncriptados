import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Dimensions,
} from "react-native";

import { ModalType, useModal } from "@/context/modal";

import IconSvg from "../IconSvg/IconSvg";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";
import { ThemeMode } from "@/context/theme";
import theme from "@/config/theme";

const ModalBasic = () => {
  const {
    modalVisible,
    modalTitle,
    modalDescription,
    oneButton,
    hideModal,
    buttonColorConfirm,
    buttonColorCancel,
    textConfirm,
    textCancel,
    modalType,
    onConfirmAction,
    onCancelAction,
  } = useModal();

  const windowWidth = Dimensions.get("window").width;

  const handleConfirm = () => {
    onConfirmAction && onConfirmAction();
    hideModal();
  };

  const handleCancel = () => {
    onCancelAction && onCancelAction();
    hideModal();
  };

  const renderIcon = (type: ModalType) => {
    switch (type) {
      case "confirm":
        return <IconSvg type={"confirm"} height={60} width={60} />;
      case "alert":
        return <IconSvg type={"alert"} height={60} width={60} />;
      case "error":
        return <IconSvg type={"error"} height={60} width={60} />;
      default:
        return null;
    }
  };

  const { themeMode } = useDarkModeTheme();


  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleCancel}
    >
      <View style={styles.centeredView}>
        <View
          style={[
            themeMode === ThemeMode.Dark
              ? styles.modalView
              : {
                  ...styles.modalView,
                  backgroundColor: theme.lightMode.colors.white,
                },
            { width: windowWidth * 0.9 },
          ]}
        >
          <View style={{ marginBottom: 20 }}>{renderIcon(modalType)}</View>
          <Text
            allowFontScaling={false}
            style={[
              themeMode === ThemeMode.Dark
                ? styles.modalText
                : {
                    ...styles.modalText,
                    color: theme.lightMode.colors.blueDark,
                  },
            ]}
          >
            {modalTitle}
          </Text>
          <Text allowFontScaling={false} style={styles.modalDescriptionText}>
            {modalDescription}
          </Text>
          <View style={styles.buttonContainer}>
            {oneButton ? (
              <Pressable
                style={[
                  styles.button,
                  {
                    backgroundColor: buttonColorConfirm || "green",
                  },
                ]}
                onPress={handleConfirm}
              >
                <Text allowFontScaling={false} style={styles.textStyle}>
                  {textConfirm}
                </Text>
              </Pressable>
            ) : (
              <>
                <Pressable
                  style={[
                    styles.button,
                    {
                      backgroundColor: buttonColorConfirm || "red",
                    },
                  ]}
                  onPress={handleConfirm}
                >
                  <Text allowFontScaling={false} style={styles.textStyle}>
                    {textConfirm}
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        buttonColorCancel ||
                        styles.buttonCancel.backgroundColor,
                    },
                    styles.buttonMarginTop,
                  ]}
                  onPress={handleCancel}
                >
                  <Text allowFontScaling={false} style={styles.textStyle}>
                    {textCancel}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "#161616",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 10,
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  modalDescriptionText: {
    marginBottom: 15,
    color: "#7F7F7F",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
  button: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    marginBottom: 10,
    width: "100%",
  },
  buttonCancel: {
    backgroundColor: "#CB0808",
  },
  buttonConfirm: {
    backgroundColor: "#10B4E7",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonMarginTop: {
    marginTop: 10,
  },
});

export default ModalBasic;