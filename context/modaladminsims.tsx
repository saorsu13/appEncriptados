import React, { createContext, useContext, useState, ReactNode } from "react";

interface ModalAdminSimsState {
  isModalOpen: boolean;
  simsList: any[];
}

interface ModalAdminSimsContextType extends ModalAdminSimsState {
  openModal: (sims?: any[]) => void;
  closeModal: () => void;
}

interface ModalAdminSimsProviderProps {
  children: ReactNode;
}

const ModalAdminSimsContext = createContext<ModalAdminSimsContextType>({
  isModalOpen: false,
  simsList: [],
  openModal: () => {},
  closeModal: () => {},
});

export const ModalAdminSimsProvider = ({
  children,
}: ModalAdminSimsProviderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simsList, setSimsList] = useState<any[]>([]);

  const openModal = (sims?: any[]) => {
    if (sims) {
      setSimsList(sims);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ModalAdminSimsContext.Provider
      value={{
        isModalOpen,
        simsList,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalAdminSimsContext.Provider>
  );
};

export const useModalAdminSims = (): ModalAdminSimsContextType => {
  return useContext(ModalAdminSimsContext);
};
