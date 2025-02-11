import React, { createContext, useContext, useState, ReactNode } from "react";

interface ModalAdminSimsState {
  isModalOpen: boolean;
}

interface ModalAdminSimsContextType extends ModalAdminSimsState {
  openModal: () => void;
  closeModal: () => void;
}

interface ModalAdminSimsProviderProps {
  children: ReactNode;
}

const ModalAdminSimsContext = createContext<ModalAdminSimsContextType>({
  isModalOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export const ModalAdminSimsProvider = ({
  children,
}: ModalAdminSimsProviderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ModalAdminSimsContext.Provider
      value={{
        isModalOpen,
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
