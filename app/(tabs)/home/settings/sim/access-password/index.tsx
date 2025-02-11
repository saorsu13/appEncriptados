import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import { ThemeCustom } from "@/config/theme2";
import { useTheme } from "@shopify/restyle";
import { router } from "expo-router";

import useLocalPassword, { passwordKey } from "@/hooks/useLocalPassword";
import CustomSwitch from "@/components/atoms/Switch";
import { useAppSelector } from "@/hooks/hooksStoreRedux";
import { useDispatch } from "react-redux";

import useModalAll from "@/hooks/useModalAll";
import { t } from "i18next";
import ModalInfo from "@/components/molecules/ModalInfo";

const AccessPassword = () => {
  const { colors } = useTheme<ThemeCustom>();

  const { getPassword, deleteCurrentPassword } = useLocalPassword();
  const [password, setPassword] = useState<string | null>(null);
  const [originalState, setOriginalState] = useState<boolean>(false);
  const [tempState, setTempState] = useState<boolean>(false);

  useEffect(() => {
    const getCurrentPassword = async () => {
      const response = await getPassword(passwordKey);
      setPassword(response);
    };

    getCurrentPassword();
  }, [password]);

  const activePass = useAppSelector(
    (state) => state.activePasswordRequired.isActive
  );

  const [modalHowToWorkVisible, setModalHowToWorkVisible] = useState(false);

  const dispatch = useDispatch();
  const { showModal } = useModalAll();

  useEffect(() => {
    setOriginalState(activePass);
    setTempState(activePass);
  }, [activePass]);

  const handleToggle = () => {
    const message = tempState
      ? t(`pages.home.modalDesactivatePasswordTitle`)
      : t(`pages.home.modalActivatePasswordTitle`);

    showModal({
      type: "confirm",
      title: message,
      buttonColorConfirm: colors.primaryColor,
      textConfirm: t(`pages.home.confirm`),
      textCancel: t(`pages.home.cancel`),
      buttonColorCancel: colors.danger,
      onConfirm: async () => {
        if (tempState) {
          router.push("/home/settings/sim/access-password/delete-password");
          setTempState(originalState);
        } else {
          router.push(
            "/home/settings/sim/access-password/create-access-password"
          );
        }
      },
      onCancel: () => {
        setTempState(originalState);
      },
    });
  };

  const handleSwitchChange = (value: boolean) => {
    setTempState(value);
    handleToggle();
  };

  return (
    <>
      <View style={{ backgroundColor: colors.background }}>
        <HeaderEncrypted iconBack="home/settings/sim" />
      </View>
      <View style={styles.container}>
        <ScrollView
          style={[styles.scrollView, { backgroundColor: colors.background }]}
        >
          <View
            style={[
              styles.contentContainer,
              { backgroundColor: colors.backgroundAlternate },
            ]}
          >
            <Text
              allowFontScaling={false}
              style={[styles.primaryText, { color: colors.primaryText }]}
            >
              {t(`pages.home.titlerequiredpassword`)}
            </Text>
            <Text
              allowFontScaling={false}
              style={[styles.secondaryText, { color: colors.secondaryText }]}
            >
              {t(`pages.home.descriptionrequiredpassword`)}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setModalHowToWorkVisible(true);
              }}
            >
              <Text
                allowFontScaling={false}
                style={[styles.underlineText, { color: colors.primaryText }]}
              >
                {t("helpMessages.howToWork")}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: "90%", alignSelf: "center" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                allowFontScaling={false}
                style={{
                  color: tempState ? colors.primaryText : "gray",
                  fontWeight: "bold",
                  fontSize: 14,
                  width: 100,
                }}
              >
                {!password
                  ? t("helpMessages.newPassword")
                  : `${t("helpMessages.actualPassword")}: ${"*".repeat(
                      password.length
                    )}`}
              </Text>
              <View
                style={{
                  backgroundColor: colors.neutro,
                  borderRadius: 10,
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                  gap: 10,
                }}
              >
                <Text
                  allowFontScaling={false}
                  style={{ color: colors.primaryColor, fontWeight: "bold" }}
                >
                  {tempState
                    ? t(`pages.voiceFilter.enabled`)
                    : t(`pages.voiceFilter.disabled`)}
                </Text>
                <CustomSwitch value={tempState} onChange={handleSwitchChange} />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          ...styles.buttonContainer,
          backgroundColor: colors.background,
        }}
      >
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primaryColor }]}
          onPress={() => {
            return router.push(
              "/home/settings/sim/access-password/create-access-password"
            );
          }}
        >
          {
            <Text
              allowFontScaling={false}
              style={[styles.buttonText, { color: colors.white }]}
            >
              {!password
                ? t("helpMessages.configPassword")
                : t("helpMessages.changePassword")}
            </Text>
          }
        </TouchableOpacity>

        <ModalInfo
          visible={modalHowToWorkVisible}
          onClose={() => {
            setModalHowToWorkVisible(false);
          }}
          title={t("pages.home.profileWarning.title")}
          description={t(`pages.home.howToReset`)}
          buttonText={t("actions.close")}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredTextContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredText: {
    fontSize: 18,
    width: 250,
    fontWeight: "bold",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: "90%",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  primaryText: {
    marginVertical: 10,
  },
  secondaryText: {
    marginVertical: 10,
  },
  underlineText: {
    marginVertical: 10,
    textDecorationLine: "underline",
  },
  buttonContainer: {
    padding: 10,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  button: {
    width: "100%",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AccessPassword;
