import React, { createContext, useContext, useState, ReactNode, useRef } from "react";

interface ModalAdminSimsState {
  isModalOpen: boolean;
  simsList: any[];
}

interface ModalAdminSimsContextType extends ModalAdminSimsState {
  openModal: (sims?: any[], onSelect?: (sim: any) => void) => void;
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

  const onSelectRef = useRef<(sim: any) => void>();

  const openModal = (sims?: any[], onSelect?: (sim: any) => void) => {
    if (sims) setSimsList(sims);
    onSelectRef.current = onSelect;
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    onSelectRef.current = undefined; 
  };

  const handlePick = (sim: any) => {
    closeModal();
    onSelectRef.current?.(sim);
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
