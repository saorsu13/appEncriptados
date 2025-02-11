import React from "react";
import { Modal, StyleSheet, View, Button } from "react-native";

import { useModalPayment } from "@/context/modalpayment";

import WebViewComponent from "../WebView/WebView";

const ModalPaymentController = () => {
  const { isModalOpen, closeModal } = useModalPayment();

  const { params } = useModalPayment();

  const { languageCode, productid, theme } = params;

  return (
    <WebViewComponent
      onClose={closeModal}
      url={`https://app.encriptados.io/api/payment/${languageCode}/${productid}/${theme}`}
      visible={isModalOpen}
    />
  );
};

export default ModalPaymentController;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalView: {
    backgroundColor: "transparent",
    borderRadius: 24,
    alignItems: "center",
    elevation: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  modalContainer: {
    display: "flex",
    padding: 10,
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
  innerContainer: {
    width: "100%",
  },
  webviewContainer: {
    width: "100%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
  },
});
