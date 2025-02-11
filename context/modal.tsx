import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
import ModalBasic from "@/components/molecules/AllModal/ModalBasic";
import ModalInfo from "@/components/molecules/ModalInfo";

export type ModalType = "alert" | "confirm" | "error" | "help";

type ModalContextType = {
  modalVisible?: boolean;
  modalType?: ModalType;
  modalTitle?: string;
  modalDescription?: string;
  textConfirm?: string;
  textCancel?: string;
  buttonColorConfirm?: string;
  buttonColorCancel?: string;
  showModal?: (modalData: ModalData & { type?: ModalType }) => void;
  hideModal?: () => void;
  onConfirmAction?: () => void;
  onCancelAction?: () => void;
  oneButton?: boolean;
};

type ModalData = {
  title?: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  oneButton?: boolean;
  textConfirm?: string;
  textCancel?: string;
  buttonColorConfirm?: string;
  buttonColorCancel?: string;
};

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<ModalType>();
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [textConfirm, setTextConfirm] = useState("Confirm");
  const [textCancel, setTextCancel] = useState("Cancel");
  const [buttonColorConfirm, setButtonColorConfirm] = useState("defaultColor");
  const [buttonColorCancel, setButtonColorCancel] = useState("defaultColor");
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(
    () => () => {}
  );
  const [onCancelAction, setOnCancelAction] = useState<() => void>(
    () => () => {}
  );
  const [oneButton, setOneButton] = useState(false);

  const showModal = ({
    type,
    title,
    description,
    onConfirm,
    onCancel,
    oneButton: modalOneButton,
    textConfirm: modalTextConfirm,
    textCancel: modalTextCancel,
    buttonColorConfirm: modalButtonColorConfirm,
    buttonColorCancel: modalButtonColorCancel,
  }: ModalData & { type: ModalType }) => {
    setModalType(type);
    setModalTitle(title || "");
    setModalDescription(description || "");
    setOnConfirmAction(() => onConfirm || (() => {}));
    setOnCancelAction(() => onCancel || (() => {}));
    setOneButton(modalOneButton !== undefined ? modalOneButton : false);
    setTextConfirm(modalTextConfirm || "Confirm");
    setTextCancel(modalTextCancel || "Cancel");
    setButtonColorConfirm(modalButtonColorConfirm || "defaultColor");
    setButtonColorCancel(modalButtonColorCancel || "defaultColor");
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setOnConfirmAction(() => () => {});
    setOnCancelAction(() => () => {});
  };

  const value = useMemo(
    () => ({
      modalVisible,
      oneButton,
      modalType,
      modalTitle,
      modalDescription,
      textConfirm,
      textCancel,
      buttonColorConfirm,
      buttonColorCancel,
      showModal,
      hideModal,
      onConfirmAction,
      onCancelAction,
    }),
    [
      modalVisible,
      oneButton,
      modalType,
      modalTitle,
      modalDescription,
      textConfirm,
      textCancel,
      buttonColorConfirm,
      buttonColorCancel,
      onConfirmAction,
      onCancelAction,
    ]
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalBasic />
      {modalType === "help" ? (
        <ModalInfo
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title={modalTitle}
          description={modalDescription}
          buttonText={textConfirm}
        />
      ) : null}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
