import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Modal, View, StyleSheet, Dimensions, AppState } from "react-native";

import { disabledKey } from "@/hooks/useLocalPassword";
import * as SecureStore from "expo-secure-store";
import { useAppSelector } from "@/hooks/hooksStoreRedux";

const ModalContext = createContext({
  openModal: () => {},
  closeModal: () => {},
  isModalVisible: false,
});

export const ModalPasswordProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const [inactiveDuration, setInactiveDuration] = useState(120000);

  const [appState, setAppState] = useState(AppState.currentState);
  const [backgroundStartTime, setBackgroundStartTime] = useState<number | null>(
    null
  );

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const activePasswordRequired = useAppSelector((state) => {
    return state.activePasswordRequired;
  });

  useEffect(() => {
    const checkPasswordRequiredOnStartup = () => {
      if (activePasswordRequired.isActive) {
        setModalVisible(true);
      }
    };

    checkPasswordRequiredOnStartup();
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isModalVisible }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalPassword = () => useContext(ModalContext);

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  modalContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 0,
  },
});
