import PinRequiredScreen from "@/components/molecules/PinInputScreen/PinRequiredScreen";
import { useAppDispatch, useAppSelector } from "@/hooks/hooksStoreRedux";
import React, { createContext, useContext, useState } from "react";
import {
  View,
  Modal,
  Button,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";

const SpecificModalContent = () => (
  <View style={styles.contentContainer}>
    <PinRequiredScreen />
  </View>
);

const ModalContext = createContext({});

const RequestPasswordComponent = () => {
  const state = useAppSelector(
    (state) => state.modalPasswordRequired.isModalVisible
  );
  return (
    <Modal transparent={true} animationType="none" visible={state}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <SpecificModalContent />
        </View>
      </View>
    </Modal>
  );
};

export const useModal = () => useContext(ModalContext);

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,

    backgroundColor: "white",
    borderRadius: 0,
    alignItems: "center",
  },
  contentContainer: {
    width: "100%",
    height: "100%",
  },
});

export default RequestPasswordComponent;
