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

import { useAuth } from "@/context/auth";
import { useAppDispatch, useAppSelector } from "@/hooks/hooksStoreRedux";
import { deleteAllSims, deleteSim } from "@/features/sims/simSlice";
import { disablePasswordRequired } from "@/features/activePasswordRequired/activePasswordRequiredSlice";
import { closeModalRequired } from "@/features/modalPasswordRequired/modalPasswordRequiredSlice";
import { t } from "i18next";
import useLocalPassword from "@/hooks/useLocalPassword";
import { router } from "expo-router";
import useModalAll from "@/hooks/useModalAll";
import { resetModalUpdate } from "@/features/settings/settingsSlice";

const MAX_ATTEMPTS = 4;

const PinRequiredScreen = () => {
  const dispatch = useAppDispatch();
  const currentSim = useAppSelector((state) => state.sims.currentSim);

  const [pin, setPin] = useState("");
  const [currentPassword, setCurrentPassword] = useState<string | null>(null);
  const [incorrectPasswordMessage, setIncorrectPasswordMessage] =
    useState(false);
  const [attempts, setAttempts] = useState(0);

  const { deleteCurrentPassword } = useLocalPassword();
  const { isLoggedIn, isLoading, signOut } = useAuth();
  const { colors } = useTheme<ThemeCustom>();

  const { getPassword } = useLocalPassword();

  useEffect(() => {
    const getCurrentPassword = async () => {
      const response = await getPassword();
      setCurrentPassword(response);
    };

    getCurrentPassword();
  }, [getPassword]);

  useEffect(() => {
    if (attempts === 4) {
    }
  }, [attempts]);

  const handlePress = (digit) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      handlePinVerification(newPin);
    }
  };

  const handleBackspace = () => {
    const newPin = pin.slice(0, -1);
    setPin(newPin);
  };

  const handlePinVerification = (newPin) => {
    if (newPin.length === 4) {
      if (newPin === currentPassword) {
        setIncorrectPasswordMessage(false);
        dispatch(closeModalRequired());
      } else {
        setIncorrectPasswordMessage(true);
        setPin("");
        Vibration.vibrate(100);
        setAttempts((prev) => prev + 1);
      }
    } else if (newPin.length > 0) {
      setIncorrectPasswordMessage(false);
    }
  };

  useEffect(() => {
    if (attempts === 4) {
      signOut();
      dispatch(deleteAllSims());
      dispatch(deleteSim(currentSim));
      deleteCurrentPassword();
      dispatch(disablePasswordRequired());
      dispatch(closeModalRequired());
      router.push("/home");
      dispatch(resetModalUpdate(true));
    }
  }, [attempts]);

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
});

export default PinRequiredScreen;
