import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";

interface Params {
  languageCode: string;
  theme: string;
  productid: string;
}

interface ModalPaymentState {
  isModalOpen: boolean;
  params: Params;
}

type Action =
  | { type: "OPEN_MODAL"; params: Params }
  | { type: "CLOSE_MODAL" }
  | { type: "SET_PARAMS"; params: Params };

type Theme = "light" | "dark";

interface ModalPaymentContextType extends ModalPaymentState {
  openModalWithParams: (id: string, theme: Theme, languageCode: string) => void;
  closeModal: () => void;
  setParams: (params: Params) => void;
}

interface ModalPaymentProviderProps {
  children: ReactNode;
}

const initialState: ModalPaymentState = {
  isModalOpen: false,
  params: {
    languageCode: "es",
    theme: "dark",
    productid: "0",
  },
};

const modalPaymentReducer = (
  state: ModalPaymentState,
  action: Action
): ModalPaymentState => {
  switch (action.type) {
    case "OPEN_MODAL":
      return { ...state, isModalOpen: true, params: action.params };
    case "CLOSE_MODAL":
      return { ...state, isModalOpen: false };
    case "SET_PARAMS":
      return { ...state, params: action.params };
    default:
      return state;
  }
};

const ModalPaymentContext = createContext<ModalPaymentContextType>({
  ...initialState,
  openModalWithParams: () => {},
  closeModal: () => {},
  setParams: () => {},
});

export const ModalPaymentProvider = ({
  children,
}: ModalPaymentProviderProps) => {
  const [state, dispatch] = useReducer(modalPaymentReducer, initialState);

  const openModalWithParams = (
    id: string,
    theme: string,
    languageCode: string
  ) => {
    dispatch({
      type: "OPEN_MODAL",
      params: { productid: id, theme, languageCode },
    });
  };

  const closeModal = () => {
    dispatch({ type: "CLOSE_MODAL" });
  };

  const setParams = (params: Params) => {
    dispatch({ type: "SET_PARAMS", params });
  };

  return (
    <ModalPaymentContext.Provider
      value={{
        ...state,
        openModalWithParams,
        closeModal,
        setParams,
      }}
    >
      {children}
    </ModalPaymentContext.Provider>
  );
};

export const useModalPayment = (): ModalPaymentContextType => {
  return useContext(ModalPaymentContext);
};
