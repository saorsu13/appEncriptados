import React, { createContext, useState, useContext, ReactNode } from "react";

interface ModalActivateSimContextType {
  isModalVisible: boolean;
  showModal: () => void;
  hideModal: () => void;
  currentSimCode: number | null;
  setCurrentSimCode: (code: number | null) => void;
  currentIdSim: number | null;
  setCurrentIdSim: (code: number | null) => void;
  typeOfProcess: ProcessType | undefined;
  setTypeOfProcess: (type: ProcessType | undefined) => void;
}

const ModalActivateSimContext = createContext<
  ModalActivateSimContextType | undefined
>(undefined);

interface ModalActivateSimProviderProps {
  children: ReactNode;
}

export type ProcessType = "signin" | "newsim";

export const ModalActivateSimProvider: React.FC<
  ModalActivateSimProviderProps
> = ({ children }) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [currentSimCode, setCurrentSimCode] = useState<number | null>(null);
  const [currentIdSim, setCurrentIdSim] = useState<number | null>(null);
  const [typeOfProcess, setTypeOfProcess] = useState<ProcessType | undefined>(
    undefined
  );

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  return (
    <ModalActivateSimContext.Provider
      value={{
        typeOfProcess,
        setTypeOfProcess,
        isModalVisible,
        showModal,
        hideModal,
        currentSimCode,
        setCurrentSimCode,
        currentIdSim,
        setCurrentIdSim,
      }}
    >
      {children}
    </ModalActivateSimContext.Provider>
  );
};

export const useModalActivateSim = (): ModalActivateSimContextType => {
  const context = useContext(ModalActivateSimContext);
  if (!context) {
    throw new Error(
      "useModalActivateSim must be used within a ModalActivateSimProvider"
    );
  }
  return context;
};
