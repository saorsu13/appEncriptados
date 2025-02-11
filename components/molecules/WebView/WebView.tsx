import { setLoading } from "@/features/loading/loadingSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/hooksStoreRedux";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import IconSvg from "../IconSvg/IconSvg";
import Loader from "../Loader";

const WebViewComponent = ({ url, visible, onClose }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const modalRequiredPassword = useAppSelector((state) => {
    return state.modalPasswordRequired.isModalVisible;
  });

  useEffect(() => {
    if (visible && !modalRequiredPassword) {
      setIsLoading(true);
    }
  }, [visible, dispatch]);

  const handleLoadStart = () => {
    if (!modalRequiredPassword) {
      setIsLoading(true);
    }
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.webviewContainer}>
          {isLoading && !modalRequiredPassword ? (
            <View style={styles.loaderContainer}>
              <Loader visible />
            </View>
          ) : null}

          <WebView
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            originWhitelist={["*"]}
            source={{ uri: url }}
            style={styles.webview}
          />

          {!isLoading && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <IconSvg color="#A9A9A9" type="closeicon" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default WebViewComponent;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  webviewContainer: {
    width: "90%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  webview: {
    backgroundColor: "#141414",
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    zIndex: 2,
  },
});
