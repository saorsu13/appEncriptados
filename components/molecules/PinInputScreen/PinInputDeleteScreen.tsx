import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from "react-native";
import { useTheme } from "@shopify/restyle";
import { ThemeCustom } from "@/config/theme2";
import IconSvg from "../IconSvg/IconSvg";
import useModalAll from "@/hooks/useModalAll";
import { router } from "expo-router";
import useLocalPassword, { passwordKey } from "@/hooks/useLocalPassword";
import { useModalPassword } from "@/context/modalpasswordprovider";
import { useMenu } from "@/context/menuprovider";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/hooks/hooksStoreRedux";
import { disablePasswordRequired } from "@/features/activePasswordRequired/activePasswordRequiredSlice";
import { deleteAllSims, deleteSim } from "@/features/sims/simSlice";
import { t } from "i18next";
import { useAuth } from "@/context/auth";
import { resetModalUpdate } from "@/features/settings/settingsSlice";

const MAX_ATTEMPTS = 5;

const PinInputDeleteScreen = () => {
  const { closeModal } = useModalPassword();
  const { isLoggedIn, isLoading, signOut } = useAuth();

  const currentSim = useAppSelector((state) => state.sims.currentSim);

  const allSims = useAppSelector((state) => state.sims.sims);

  const { deleteCurrentPassword } = useLocalPassword();
  const [pin, setPin] = useState("");
  const [currentPassword, setCurrentPassword] = useState<string | null>(null);
  const [incorrectPasswordMessage, setIncorrectPasswordMessage] =
    useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { isMenuVisible, setIsMenuVisible } = useMenu();

  const dispatch = useAppDispatch();

  useEffect(() => {
    return setIsMenuVisible(false);
  }, [isMenuVisible]);

  const handlePress = (digit) => {
    if (pin.length < 4) {
      setPin(pin + digit);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const { colors } = useTheme<ThemeCustom>();
  const { showModal } = useModalAll();
  const { getPassword } = useLocalPassword();

  useEffect(() => {
    const getCurrentPassword = async () => {
      const response = await getPassword(passwordKey);
      setCurrentPassword(response);
    };

    getCurrentPassword();
  }, [getPassword]);

  const checkPin = () => {
    if (pin.length === 4) {
      if (pin === currentPassword) {
        setIncorrectPasswordMessage(false);
        setShowConfirmModal(true); // Show the confirmation modal
      } else {
        setIncorrectPasswordMessage(true);
        setPin("");
        Vibration.vibrate(100);
        setAttempts((prev) => prev + 1);
      }
    } else if (pin.length > 0) {
      setIncorrectPasswordMessage(false);
    }
  };

  useEffect(() => {
    if (attempts >= MAX_ATTEMPTS) {
      signOut();
      dispatch(deleteAllSims());
      dispatch(deleteSim(currentSim));
      dispatch(disablePasswordRequired());
      deleteCurrentPassword();
      closeModal();
      router.push("/home");
      dispatch(resetModalUpdate(true));
    }
  }, [attempts]);

  const handleConfirmDelete = () => {
    deleteCurrentPassword();
    dispatch(disablePasswordRequired());
    setShowConfirmModal(false);
    closeModal();
    router.push("/home/settings/sim/access-password/");
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  useEffect(() => {
    if (showConfirmModal) {
      showModal({
        type: "confirm",
        buttonColorConfirm: colors.primaryColor,
        buttonColorCancel: colors.danger,
        textConfirm: t("pages.home.confirm"),
        textCancel: t("pages.home.cancel"),
        title: t("pages.home.confirmDeletePassword"),
        onConfirm: handleConfirmDelete,
        onCancel: () => {
          router.push("/home/settings/sim/access-password/");
        },
      });
    }
  }, [showConfirmModal]);

  useEffect(() => {
    checkPin();
  }, [pin]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.lockIconContainer}>
        <IconSvg type="userpassword" />
      </View>
      <Text
        allowFontScaling={false}
        style={{ ...styles.instructions, color: colors.primaryText }}
      >
        {t(`pages.home.introducePasswordDevice`)}
      </Text>

      <View style={styles.pinContainer}>
        {[0, 1, 2, 3].map((_, index) => (
          <View
            key={index}
            style={[
              styles.pinDot,
              {
                backgroundColor: pin[index] ? colors.primaryColor : "gray",
                borderWidth: pin[index] ? 0 : 0,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.messageContainer}>
        {incorrectPasswordMessage && (
          <View>
            <Text
              allowFontScaling={false}
              style={{ color: colors.danger, textAlign: "center" }}
            >
              {t(`pages.home.tryAgainPasswordTitle`)}
            </Text>
            <Text
              allowFontScaling={false}
              style={{ color: colors.danger, textAlign: "center" }}
            >
              {`${t("pages.home.youHave")} ${MAX_ATTEMPTS - attempts} ${t(
                `pages.home.attempt`
              )}`}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.keyboard}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "#", 0].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.key}
            onPress={() => handlePress(item.toString())}
          >
            <Text
              allowFontScaling={false}
              style={[styles.keyText, { color: colors.white }]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.key} onPress={handleBackspace}>
          <IconSvg
            color={colors.white}
            width={20}
            height={20}
            type="erasetext"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lockIconContainer: {
    marginBottom: 20,
  },
  instructions: {
    width: 220,
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
    color: "#fff",
  },
  pinContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  pinDot: {
    width: 18,
    height: 18,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  messageContainer: {
    height: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  keyboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "80%",
    justifyContent: "space-between",
  },
  key: {
    width: "26%",
    height: 79,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    backgroundColor: "#333",
  },
  keyText: {
    fontSize: 24,
    padding: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparente para el fondo
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default PinInputDeleteScreen;
