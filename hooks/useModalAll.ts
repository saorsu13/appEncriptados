import { useContext } from "react";
import { ModalContext } from "@/context/modal";

const useModalAll = () => {
  const { showModal } = useContext(ModalContext);

  return { showModal };
};

export default useModalAll;
