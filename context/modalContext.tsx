import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useMemo,
  } from "react";
  
  export type ModalType = "alert" | "confirm" | "error" | "help";
  
  export type ModalContextType = {
    modalVisible: boolean;
    modalType?: ModalType;
    modalTitle: string;
    modalDescription: string;
    textConfirm: string;
    textCancel: string;
    buttonColorConfirm: string;
    buttonColorCancel: string;
    onConfirmAction: () => void;
    onCancelAction: () => void;
    oneButton: boolean;
    showModal: (data: {
      type: ModalType;
      title?: string;
      description?: string;
      onConfirm?: () => void;
      onCancel?: () => void;
      oneButton?: boolean;
      textConfirm?: string;
      textCancel?: string;
      buttonColorConfirm?: string;
      buttonColorCancel?: string;
    }) => void;
    hideModal: () => void;
  };
  
  const ModalContext = createContext<ModalContextType | undefined>(undefined);
  
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
    const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => () => {});
    const [onCancelAction, setOnCancelAction] = useState<() => void>(() => () => {});
    const [oneButton, setOneButton] = useState(false);
  
    const showModal: ModalContextType["showModal"] = ({
      type,
      title,
      description,
      onConfirm,
      onCancel,
      oneButton: _oneButton,
      textConfirm: _textConfirm,
      textCancel: _textCancel,
      buttonColorConfirm: _btnColorConfirm,
      buttonColorCancel: _btnColorCancel,
    }) => {
      setModalType(type);
      setModalTitle(title ?? "");
      setModalDescription(description ?? "");
      setOnConfirmAction(() => onConfirm ?? (() => {}));
      setOnCancelAction(() => onCancel ?? (() => {}));
      setOneButton(_oneButton ?? false);
      setTextConfirm(_textConfirm ?? "Confirm");
      setTextCancel(_textCancel ?? "Cancel");
      setButtonColorConfirm(_btnColorConfirm ?? "defaultColor");
      setButtonColorCancel(_btnColorCancel ?? "defaultColor");
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
        modalType,
        modalTitle,
        modalDescription,
        textConfirm,
        textCancel,
        buttonColorConfirm,
        buttonColorCancel,
        onConfirmAction,
        onCancelAction,
        oneButton,
        showModal,
        hideModal,
      }),
      [
        modalVisible,
        modalType,
        modalTitle,
        modalDescription,
        textConfirm,
        textCancel,
        buttonColorConfirm,
        buttonColorCancel,
        onConfirmAction,
        onCancelAction,
        oneButton,
      ]
    );
  
    return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
  };
  
  export const useModal = (): ModalContextType => {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error("useModal must be used within ModalProvider");
    return ctx;
  };  