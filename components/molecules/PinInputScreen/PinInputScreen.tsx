import React, { useState, useEffect } from "react";
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
import { useAppDispatch, useAppSelector } from "@/hooks/hooksStoreRedux";
import {
  disablePasswordRequired,
  enablePasswordRequired,
} from "@/features/activePasswordRequired/activePasswordRequiredSlice";
import { useMenu } from "@/context/menuprovider";
import { deleteAllSims, deleteSim } from "@/features/sims/simSlice";
import { useModalPassword } from "@/context/modalpasswordprovider";
import { useAuth } from "@/context/auth";
import { t } from "i18next";
import { useDispatch } from "react-redux";
import { resetModalUpdate } from "@/features/settings/settingsSlice";

const MAX_ATTEMPTS = 5;

const PinInputScreen = () => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [verifyActualPassword, setVerifyActualPassword] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const [actualPassword, setActualPassword] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const currentSim = useAppSelector((state) => state.sims.currentSim);
  const [incorrectPasswordMessage, setIncorrectPasswordMessage] =
    useState(false);
  const { closeModal } = useModalPassword();
  const { isLoggedIn, isLoading, signOut } = useAuth();
  const { savePassword, getPassword, deleteCurrentPassword } =
    useLocalPassword();
  const { colors } = useTheme<ThemeCustom>();
  const { showModal } = useModalAll();
  const dispatch = useAppDispatch();
  const { isMenuVisible, setIsMenuVisible } = useMenu();

  useEffect(() => {
    const fetchCurrentPassword = async () => {
      const currentPassword = await getPassword(passwordKey);
      setActualPassword(currentPassword);
      if (!currentPassword) {
        setIsVerifying(false);
      }
    };

    fetchCurrentPassword();
  }, [getPassword]);

  useEffect(() => {
    setIsMenuVisible(false);
  }, [isMenuVisible]);

  const checkPin = () => {
    if (isVerifying && verifyActualPassword.length === 4) {
      if (actualPassword && verifyActualPassword === actualPassword) {
        setIsVerifying(false);
      } else if (actualPassword) {
        setAttempts((prev) => prev + 1);
        setIncorrectPasswordMessage(true);
        Vibration.vibrate(100);
        setPin("");
        setVerifyActualPassword("");
        if (attempts + 1 >= MAX_ATTEMPTS) {
          signOut();
          dispatch(deleteAllSims());
          dispatch(deleteSim(currentSim));
          dispatch(disablePasswordRequired());
          deleteCurrentPassword();
          closeModal();
          router.push("/home");
          dispatch(resetModalUpdate(true));
        }
      } else {
        setIsVerifying(false);
      }
    } else if (pin.length === 4 && !isConfirming && !isVerifying) {
      setIsConfirming(true);
    } else if (confirmPin.length === 4 && isConfirming) {
      if (pin === confirmPin) {
        if (!isConfirmed) {
          showModal({
            type: "alert",
            buttonColorConfirm: colors.primaryColor,
            buttonColorCancel: colors.danger,
            textConfirm: t("pages.home.confirm"),
            textCancel: t("pages.home.cancel"),
            title: t("pages.home.confirmNewPassword"),
            onConfirm: () => {
              savePassword(confirmPin);
              setIsConfirmed(true);
              dispatch(enablePasswordRequired());
              router.push("/home/settings/sim/access-password/");
            },
            onCancel: () => {
              setPin("");
              setConfirmPin("");
              setIsConfirming(false);
              router.push("/home/settings/sim/access-password/");
            },
          });
        }
      } else {
        showModal({
          type: "alert",
          buttonColorConfirm: colors.primaryColor,
          buttonColorCancel: colors.danger,
          textConfirm: t("pages.home.tryAgain"),
          textCancel: t("pages.home.backToPasswords"),
          title: t("pages.home.passwordDontMatch"),
          onConfirm: () => {
            setPin("");
            setConfirmPin("");
            setIsConfirming(false);
          },
          onCancel: () => {
            router.push("/home/settings/sim/access-password/");
          },
        });
      }
    }
  };

  useEffect(() => {
    checkPin();
  }, [
    pin,
    confirmPin,
    verifyActualPassword,
    actualPassword,
    isConfirming,
    isVerifying,
    isConfirmed,
    attempts,
  ]);

  const handlePress = (digit: string) => {
    setIncorrectPasswordMessage(false);
    if (isVerifying) {
      if (verifyActualPassword.length < 4) {
        setVerifyActualPassword(verifyActualPassword + digit);
      }
    } else if (isConfirming) {
      if (confirmPin.length < 4) {
        setConfirmPin(confirmPin + digit);
      }
    } else {
      if (pin.length < 4) {
        setPin(pin + digit);
      }
    }
  };

  const handleBackspace = () => {
    if (isVerifying) {
      setVerifyActualPassword(verifyActualPassword.slice(0, -1));
    } else if (isConfirming) {
      setConfirmPin(confirmPin.slice(0, -1));
    } else {
      setPin(pin.slice(0, -1));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.lockIconContainer}>
        <IconSvg type="userpassword" />
      </View>
      <Text
        allowFontScaling={false}
        style={{ ...styles.instructions, color: colors.primaryText }}
      >
        {isVerifying
          ? t("pages.home.introduceActualPassword")
          : isConfirming
          ? t("pages.home.confirmPassword")
          : t("pages.home.introducePassword")}
      </Text>
      <View style={styles.pinContainer}>
        {[0, 1, 2, 3].map((_, index) => (
          <View
            key={index}
            style={[
              styles.pinDot,
              {
                backgroundColor: isVerifying
                  ? verifyActualPassword[index]
                    ? colors.primaryColor
                    : "gray"
                  : isConfirming
                  ? confirmPin[index]
                    ? colors.primaryColor
                    : "gray"
                  : pin[index]
                  ? colors.primaryColor
                  : "gray",
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
              {t("pages.home.tryAgainPasswordTitle")}
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
});

export default PinInputScreen;
