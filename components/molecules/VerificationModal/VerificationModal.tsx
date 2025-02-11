import theme from "@/config/theme";
import React, { ReactNode } from "react";
import { Modal, StyleSheet, Text, Pressable, View } from "react-native";

import IconSvg from "../IconSvg/IconSvg";
import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";

type props = {
  icon: ReactNode;
  title: string;
  message: string;
  closeBtn?: boolean;
  modalVisible: boolean;
  closeModal: () => void;
  children: ReactNode;
  variant?: "info";
  mode?: "dark" | "light";
};

const VerificationModal = ({
  icon,
  title,
  message,
  closeBtn = false,
  modalVisible,
  closeModal,
  children,
  variant,
  mode,
}: props) => {
  const { themeMode } = useDarkModeTheme();
  const handleClose = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <Pressable style={styles.centeredView} onPress={handleClose}>
          <View
            style={[
              styles.modalView,
              styles[`${variant}ModalView`],
              styles[`${mode}ModalView`],
            ]}
          >
            {closeBtn && (
              <Pressable style={styles.closeBtn} onPress={() => closeModal()}>
                <IconSvg height={25} width={25} type="closeicon" />
              </Pressable>
            )}

            {variant ? (
              <View style={styles.containerHeader}>
                <View style={styles.containerHeaderContent}>
                  {icon}
                  <Text
                    allowFontScaling={false}
                    style={[styles.title, styles.titleInfo]}
                  >
                    {title}
                  </Text>
                </View>

                <Text
                  allowFontScaling={false}
                  style={[styles.message, styles.messageInfo]}
                >
                  {message}
                </Text>
              </View>
            ) : (
              <>
                {icon}

                <View style={styles.textContainer}>
                  <Text
                    allowFontScaling={false}
                    style={[styles.title, styles[`${mode}Title`]]}
                  >
                    {title}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={[styles.message, styles[`${mode}Message`]]}
                  >
                    {message}
                  </Text>
                </View>
              </>
            )}

            <View style={styles.textContainer}>{children}</View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 40,
    alignItems: "center",
    shadowColor: "#000",

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "85%",
    display: "flex",
    flexDirection: "column",
    gap: 40,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    width: "100%",
  },
  title: {
    textAlign: "center",
    color: theme.colors.primarySummary,
    ...theme.textVariants.modalSummary,
  },
  message: {
    textAlign: "center",
    color: theme.colors.contentSummary,
    paddingHorizontal: 10,
    ...theme.textVariants.contentSummary,
  },
  closeBtn: {
    position: "absolute",
  },
  containerHeader: {
    gap: 15,
  },
  containerHeaderContent: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 15,
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#D9D9D9",
  },
  titleInfo: {
    color: theme.colors.mainAction,
    textAlign: "left",
  },
  messageInfo: {
    textAlign: "left",
    paddingHorizontal: 0,
  },
  infoModalView: {
    gap: 20,
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  darkModalView: {
    backgroundColor: theme.colors.darkBlack01,
  },

  lightModalView: {
    backgroundColor: theme.lightMode.colors.white,
  },
  darkTitle: {
    color: theme.colors.listTitle,
    fontSize: 16,
  },
  darkMessage: {
    color: theme.colors.contentSummary,
    fontFamily: theme.textVariants.modalSummary.fontFamily,
    fontSize: 14,
  },
});

export default VerificationModal;
